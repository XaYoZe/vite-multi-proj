import path from 'path';
import { getProjectPaths } from './vite.config.base';
const { rootPath, projectPath } = getProjectPaths();

export default {
  'COMMON': path.join(rootPath, './common'),
  'ASSETS': path.join(rootPath, './common/assets/'),
  'IMAGES': path.join(rootPath, './common/assets/images'),
  'STYLES': path.join(rootPath, './common/assets/styles'),
  'UTILS': path.join(rootPath, './common/utils'),
  '@': path.join(projectPath, './'),
  '@api': path.join(projectPath, './api'),
  '@i18n': path.join(projectPath, './i18n'),
  '@compo': path.join(projectPath, './components'),
  '@router': path.join(projectPath, './router'),
  '@layouts': path.join(projectPath, './layouts'),
  '@stores': path.join(projectPath, './stores'),
  '@pages': path.join(projectPath, './pages'),
  '@assets': path.join(projectPath, './assets/'),
  '@styles': path.join(projectPath, './assets/styles'),
  '@images': path.join(projectPath, './assets/images'),
  '@public': path.join(projectPath, './public')
};
