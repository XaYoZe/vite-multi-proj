import 'UTILS/jsBridge';
import { createApp } from 'vue';
import 'STYLES/style-reset.scss';
import App from '@layouts/index.vue';
import stores from '@stores/index';
import router from '@router/index';
import i18n from '@i18n/index';

console.log('构建时间:', __BUILD_TIME__);
console.log('构建项目:', __PROJECT__);

createApp(App).use(stores).use(router).use(i18n).mount('#app');
