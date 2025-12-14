import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = process.cwd();

const getOutputDir = folderProject => {
  if (folderProject) {
    const [directoryName, projectName] = folderProject.split(':');
    if (!directoryName || !projectName) {
      return false;
    }
    return path.join(rootPath, 'src', directoryName, projectName);
  }
  return false;
};

// 检查命令行参数中是否包含 "目录:项目" 格式
function parseCommandLineArgs() {
  const args = process.argv.slice(2);
  let parsedData = {};

  // 处理参数
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // 处理 "目录:项目" 格式的参数
    if (arg === '--FolderProject') {
      let nextArg = args[i + 1];
      if (nextArg && nextArg.indexOf(':') !== -1) {
        parsedData.FolderProject = nextArg;
        if (fs.existsSync(getOutputDir(nextArg))) {
          throw '\n输出目录已存在:' + getOutputDir(nextArg);
        }
        continue;
      }
    }

    // 处理其他参数
    if (arg === '--router') {
      parsedData.useRouter = true;
    } else if (arg === '--i18n') {
      parsedData.useI18n = true;
    } else if (arg.startsWith('--projectName=')) {
      parsedData.projectName = arg.split('=')[1];
    } else if (arg.startsWith('--directoryName=')) {
      parsedData.directoryName = arg.split('=')[1];
    } else if (arg.startsWith('--useRouter=')) {
      parsedData.useRouter = arg.split('=')[1] === 'true';
    } else if (arg.startsWith('--useI18n=')) {
      parsedData.useI18n = arg.split('=')[1] === 'true';
    }
  }

  return parsedData;
}

// 递归查找文件
function findHbsFiles(dir, pattern = '**/*.hbs') {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(
        path.relative(path.join(__dirname, '..', 'templates', 'project'), fullPath),
        ...findHbsFiles(fullPath, pattern)
      );
    } else if (entry.isFile() && entry.name.endsWith('.hbs')) {
      files.push(path.relative(path.join(__dirname, '..', 'templates', 'project'), fullPath));
    }
  }

  return files;
}

export default function (plop) {
  // 解析命令行参数
  const cliArgs = parseCommandLineArgs();

  // 检查是否有足够的参数进行非交互模式
  const hasFolderProject = cliArgs.FolderProject;

  const prompts = [
    // 如果有必需参数，不显示 prompts
    {
      type: 'confirm',
      name: 'usePinia',
      message: '是否使用 Pinia?',
      default: true
    },
    {
      type: 'confirm',
      name: 'useRouter',
      message: '是否使用 Vue Router?',
      default: true
    },
    {
      type: 'confirm',
      name: 'useI18n',
      message: '是否使用 Vue I18n?',
      default: true
    }
  ];

  if (!hasFolderProject) {
    prompts.unshift({
      type: 'input',
      name: 'FolderProject',
      message: '请输入项目名称(年份:项目):',
      validate: value => {
        if (!value) {
          return '请输入正确的项目名称(例: demo:test):';
        }
        // 创建输出目录
        if (fs.existsSync(getOutputDir(value))) {
          return '输出目录已存在';
        }
        return true;
      }
    });
  }
  // 创建空目录
  plop.setActionType('dir', function (answers, config, plop) {
    return new Promise((resolve, reject) => {
      const dirPath = plop.renderString(config.path, answers);

      fs.mkdir(dirPath, { recursive: true }, err => {
        if (err) {
          reject(err);
        } else {
          resolve(`Created directory: ${dirPath}`);
        }
      });
    });
  });
  plop.setGenerator('project', {
    description: '创建基于 Vue3 的 project 项目模板',
    prompts: prompts,
    actions: function (data) {
      const actions = [];

      // 合并 CLI 参数和用户输入
      const finalData = {
        ...cliArgs,
        ...data
      };

      // 计算正确的输出路径
      const outputPath = getOutputDir(finalData.FolderProject);
      console.log(`🎉 输出路径: ${outputPath}`);
      console.log(`📋 项目信息: ${finalData.projectName} 在 ${finalData.directoryName} 目录`);
      console.log(
        `⚙️  配置: 
  pinia: ${finalData.usePinia ? '是' : '否'},
  Router: ${finalData.useRouter ? '是' : '否'},
  I18n: ${finalData.useI18n ? '是' : '否'}`
      );

      // 查找所有 hbs 文件
      const templateDir = path.join(__dirname, '..', 'templates', 'project');
      const hbsFiles = findHbsFiles(templateDir);

      // 为每个 hbs 文件创建动作
      hbsFiles.forEach(hbsFile => {
        const templatePath = path.join(templateDir, hbsFile);

        const destPath = path.join(outputPath, hbsFile.replace('.hbs', ''));

        // 跳过条件文件
        if (!finalData.useRouter && /^router/.test(hbsFile)) {
          return;
        }
        if (!finalData.useI18n && /^i18n/.test(hbsFile)) {
          return;
        }
        if (!finalData.usePinia && /^stores/.test(hbsFile)) {
          return;
        }
        // 文件夹
        if (/\.\w+$/.test(destPath)) {
          actions.push({
            type: 'add',
            path: destPath,
            templateFile: templatePath,
            data: finalData
          });
        } else {
          actions.push({
            type: 'dir',
            path: destPath
          });
        }
      });

      return actions;
    }
  });
}
