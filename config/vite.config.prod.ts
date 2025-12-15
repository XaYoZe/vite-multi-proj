import path from 'path';
import type { UserConfig } from 'vite';
import { uploadToS3 } from './plugins/rollup-plugin-upload-to-s3';
import { createBaseConfig, getProjectPaths, parseCommandLineArgs } from './vite.config.base';
import { loadEnv, defineConfig, mergeConfig } from 'vite';
import Sonda from 'sonda/vite';
import legacy from '@vitejs/plugin-legacy';

// import { visualizer } from 'rollup-plugin-visualizer';

// 正式环境构建配置
export default defineConfig(config => {
  const { projectPath, outDir, rootPath, project } = getProjectPaths();
  const commandLineArgs = parseCommandLineArgs();

  const env = loadEnv(config.mode, path.join(rootPath, './config/env'), '');

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
  const plugins = [
    legacy(),
    uploadToS3({
      enbled: commandLineArgs.s3,
      env,
      ...config
    }),
    Sonda({
      enabled: commandLineArgs.sonda,
      deep: true,
      sources: true,
      gzip: true,
      filename: `${project}_${new Date().toLocaleString().replace(/[\\\/: ]/g, '')}.sonda.html`
    })
  ];

  // 如果配置了 CDN URL，则添加链接替换插件
  if (vendorCdnUrl) {
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
