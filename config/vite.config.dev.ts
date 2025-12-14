import { defineConfig, loadEnv, mergeConfig } from 'vite';
import path from 'path';
import vueDevTools from 'vite-plugin-vue-devtools';
import checker from 'vite-plugin-checker';
import { createBaseConfig, getProjectPaths } from './vite.config.base';

// 开发环境配置
export default defineConfig(config => {
  const { rootPath } = getProjectPaths();

  const env = loadEnv(config.mode, path.join(rootPath, './config/env'), '');

  const beseConfig = createBaseConfig({ env, ...config });

  return mergeConfig(beseConfig, {
    server: {
      host: '0.0.0.0'
      // 不指定端口，让Vite自动选择可用端口
    },
    plugins: [vueDevTools(), checker({ vueTsc: true })]
  });
});
