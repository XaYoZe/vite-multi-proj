import { defineConfig, loadEnv, mergeConfig } from 'vite';
import path from 'path';
import vueDevTools from 'vite-plugin-vue-devtools';
import checker from 'vite-plugin-checker';
import { createBaseConfig, getProjectPaths, parseCommandLineArgs } from './vite.config.base';

// 开发环境配置
export default defineConfig(config => {
  const { rootPath } = getProjectPaths();
  const commandLineArgs = parseCommandLineArgs();
  const env = Object.assign(
    {},
    loadEnv(config.mode, path.join(rootPath, './config/env'), ''),
    commandLineArgs
  );

  const beseConfig = createBaseConfig({ env, ...config });

  return mergeConfig(beseConfig, {
    server: {
      host: '0.0.0.0'
      // 不指定端口，让Vite自动选择可用端口
    },
    plugins: [
      vueDevTools(),
      checker({
        vueTsc: true
      })
    ]
  });
});
