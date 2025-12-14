import { type Plugin } from 'vite';
import { type ConfigEnv } from 'vite';
import { S3Client, PutObjectCommand, type S3ClientConfig } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getProjectPaths } from '../vite.config.base';
import path from 'path';
import fs from 'fs';
import { lookup } from 'mime-types';

class S3UploadClient {
  config: Record<string, any> = {};
  s3Client?: S3Client;
  constructor(uploadConfig: Record<string, any>) {
    // 创建S3客户端
    this.config = uploadConfig;
    this.s3Client = this.initS3Client();
  }
  initS3Client() {
    const s3ClientConfig: S3ClientConfig = {
      region: this.config.region,
      endpoint: '',
      forcePathStyle: false,
      credentials: {
        accessKeyId: this.config.accessKeyId!,
        secretAccessKey: this.config.secretAccessKey!
      }
    };

    if (this.config.endpoint) {
      s3ClientConfig.endpoint = `https://${this.config.endpoint}`;
      s3ClientConfig.forcePathStyle = true; // 对于非AWS S3服务，通常需要启用路径样式
    }
    if (!this.config.accessKeyId || !this.config.secretAccessKey) {
      console.error('❌ 缺少必需的环境变量:');
      console.error('   AWS_ACCESS_KEY_ID');
      console.error('   AWS_SECRET_ACCESS_KEY');
      console.error('   S3_BUCKET_NAME');
      process.exit(1);
    }
    const s3Client = new S3Client(s3ClientConfig);
    return s3Client;
  }

  // 递归查找文件
  findFiles(dir: string): string[] {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...this.findFiles(fullPath));
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }
  // 循环上传
  loopUpload(index: number, cb?: Function) {
    const fileUrl = this.uploadList.shift();
    if (!fileUrl) {
      return;
    }
    this.uploadFile(fileUrl).then(result => {
      if (result) {
        this.scuccessList.push(fileUrl);
      } else {
        this.totalCount--;
      }
      if (this.scuccessList.length === this.totalCount) {
        cb && cb();
        return;
      }
      this.loopUpload(index, cb);
    });
  }

  uploadList: string[] = [];
  scuccessList: string[] = [];
  totalCount: number = 0;
  upload(pathUrl: string) {
    const files = this.findFiles(pathUrl);
    this.config.outDir = pathUrl;

    if (files.length === 0) {
      console.log('⚠️  没有找到需要上传的文件');
      return [];
    }
    // 等待上传的列表
    this.uploadList = files;
    this.totalCount = files.length;
    const limit =
      this.config.maxUploadCount > files.length ? files.length : this.config.maxUploadCount;
    return new Promise(async (resolve, _) => {
      for (let i = 0; i < limit; i++) {
        this.loopUpload(i + 1, () => {
          resolve(true);
        });
      }
    });
  }

  // 设置缓存控制头
  getCacheControl(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();

    // 静态资源设置长期缓存
    if (
      [
        '.js',
        '.css',
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.svg',
        '.ico',
        '.woff',
        '.woff2',
        '.ttf',
        '.eot'
      ].includes(ext)
    ) {
      return 'public, max-age=604800'; // 1年
    }

    // HTML文件不缓存（确保首屏HTML总是最新）
    if (ext === '.html') {
      return 'private, no-cache, must-revalidate';
    }

    // 其他文件设置中等缓存
    return 'public, max-age=604800'; // 1天
  }

  // 上传文件到S3
  async uploadFile(localPath: string) {
    const s3Key = path
      .join(
        this.config.s3Prefix,
        path.relative(path.join(this.config.rootPath, './dist'), localPath)
      )
      .replace(/\\/g, '/');

    try {
      const fileStream = fs.createReadStream(localPath);
      const stats = fs.statSync(localPath);
      // console.log(s3Key, stats, localPath);

      const uploadParams = {
        Bucket: this.config.bucketName,
        Key: s3Key,
        Body: fileStream,
        ContentType: lookup(localPath) || 'application/octet-stream',
        CacheControl: this.getCacheControl(localPath),
        ContentLength: stats.size
      };

      console.log(`🚀 开始上传: ${s3Key}`);
      // 对于大文件使用分片上传
      if (stats.size > 5 * 1024 * 1024) {
        // 5MB
        const upload = new Upload({
          client: this.s3Client!,
          params: uploadParams
        });

        await upload.done();
      } else {
        const command = new PutObjectCommand(uploadParams);
        await this.s3Client?.send(command);
      }

      console.log(`✅ 上传成功: ${s3Key}`);
      return true;
    } catch (error) {
      console.error(`❌ 上传失败 ${s3Key}:`, (error as any)?.message);
      return false;
    }
  }
}

// 上传构建目录到S3
export function uploadToS3(config: { env?: Record<string, string> } & ConfigEnv): Plugin {
  // 构建目录
  const { outDir, rootPath } = getProjectPaths();
  // 从环境变量获取配置
  const uploadConfig = {
    rootPath,
    maxUploadCount: 5,
    region: config.env?.AWS_REGION || 'us-west-2',
    accessKeyId: config.env?.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.env?.AWS_SECRET_ACCESS_KEY,
    bucketName: config.env?.S3_BUCKET_NAME,
    s3Prefix: config.env?.S3_PREFIX || 'sailing/h5',
    distributionPath: config.env?.DIST_PATH || '.output/public',
    endpoint: config.env?.S3_ENDPOINT
  };

  const s3UploadClient = new S3UploadClient(uploadConfig);

  return {
    name: 'upload-to-s3',
    apply: 'build',
    closeBundle: {
      order: 'post',
      async handler() {
        console.log('🎉 构建完成，开始上传到 S3...');
        console.log(`📁 构建输出路径: ${outDir}`);
        console.log(`🪣 S3 存储桶: ${uploadConfig.bucketName}`);
        console.log(`🚀 最大并发上传数: ${uploadConfig.maxUploadCount}`);
        await s3UploadClient.upload(outDir);
        console.log('🎇 所有文件上传成功');
      }
    }
  };
}
