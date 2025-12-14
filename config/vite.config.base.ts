import path from 'path';
import vue from '@vitejs/plugin-vue';
import vuePluginOptions from './vue.config';
import type { UserConfig, ConfigEnv } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import alias from './alias';
// import Sonda from 'sonda/vite';

// 解析命令行参数的辅助函数
export function parseCommandLineArgs() {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('--')) {
        result[key] = nextArg;
        i++;
      } else {
        result[key] = 'true';
      }
    }
  }

  return result;
}

// 获取项目路径配置
export function getProjectPaths() {
  const commandLineArgs = parseCommandLineArgs();
  const folderParam = commandLineArgs.Folder;
  const [folder, project] = folderParam?.split(':') ?? [];

  if (!folder || !project) {
    throw new Error('缺少目标项目格式：年份:项目名, 例: pnpm dev 0000:share');
  }

  const rootPath = path.resolve(process.cwd(), './');
  const projectPath = path.resolve(process.cwd(), './src', folder, project);
  const outDir = path.resolve(process.cwd(), './dist', project);

  return { rootPath, projectPath, outDir, project, folder };
}

// 公用配置
export function createBaseConfig(config: { env?: Record<string, string> } & ConfigEnv): UserConfig {
  const { rootPath, projectPath, project, folder } = getProjectPaths();
  const commandLineArgs = parseCommandLineArgs();

  console.log('环境模式:', config.mode);
  console.log('命令:', config.command);
  console.log('命令行参数:', commandLineArgs);
  console.log('Folder参数值:', `${folder}:${project}`);
  console.log('根目录:', rootPath);
  console.log('项目路径:', projectPath);

  return {
    envDir: path.join(rootPath, './config/env'),
    root: projectPath,
    publicDir: path.join(projectPath, './public'),
    base: './',
    optimizeDeps: {
      exclude: ['node_modules']
    },
    css: {
      postcss: './config/postcss.config.js',
      devSourcemap: config.mode === 'development',
      preprocessorOptions: {
        scss: {
          additionalData: (source: string, filename: string) => {
            if (filename.endsWith('mixin.scss')) {
              return source;
            }
            return `@use "STYLES/mixin.scss" as *;` + source;
          }
        }
      }
    },
    plugins: [vue(vuePluginOptions), legacy()],
    define: {
      API_BASE_URL: JSON.stringify(config.env?.API_BASE_URL),
      __PROJECT__: JSON.stringify(project),
      __BUILD_TIME__: JSON.stringify(new Date().toLocaleString())
      // __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    },
    resolve: {
      extensions: ['.js', '.ts', '.mjs', '.jsx', '.tsx', '.json'],
      alias
    }
  };
}
