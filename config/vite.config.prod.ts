import path from 'path';
import type { UserConfig } from 'vite';
import { uploadToS3 } from './plugins/rollup-plugin-upload-to-s3';
import { replaceVendorLinks } from './plugins/rollup-plugin-replace-vendor-links';
import { createBaseConfig, getProjectPaths } from './vite.config.base';
import { loadEnv, defineConfig, mergeConfig } from 'vite';

// 正式环境构建配置
export default defineConfig(config => {
  const { projectPath, outDir, rootPath } = getProjectPaths();

  const env = loadEnv(config.mode, path.join(rootPath, './config/env'), '');

  console.log(env, config);
  const beseConfig = createBaseConfig({ env, ...config });

  // 获取 Vendor CDN 基础 URL（优先使用环境变量，否则使用测试值）
  const vendorCdnUrl = env?.CDN_URL || '';

  // 配置手动分块，将 Vue 相关库分离为独立的 vendor 文件
  const manualChunks = {
    // Vue 核心库包
    // Vue 路由库包
    // Vue 状态管理库包
    // 其他工具库包（可根据需要添加）
    lib: ['vue', 'vue-router', 'pinia', 'axios']
  };

  // 构建插件数组
  const plugins = [uploadToS3({ env, ...config })];

  // 如果配置了 CDN URL，则添加链接替换插件
  if (vendorCdnUrl) {
    plugins.push(
      replaceVendorLinks({
        vendorCdnUrl,
        outputDir: outDir
      })
    );
  }

  return mergeConfig(beseConfig, {
    preview: {
      host: '0.0.0.0'
    },
    build: {
      outDir: outDir,
      emptyOutDir: true,
      sourcemap: config.mode === 'development' ? true : false,
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          // 配置手动分块，将 Vue 相关库分离为独立的 vendor 文件
          manualChunks
        },
        input: {
          main: path.join(projectPath, './index.html')
        }
      }
    },
    plugins
  } as UserConfig);
});
