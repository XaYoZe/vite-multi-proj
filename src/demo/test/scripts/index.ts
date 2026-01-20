import 'UTILS/jsBridge';
import { createApp } from 'vue';
import 'STYLES/style-reset.scss';
import 'vant/lib/index.css';
import '@styles/index.scss';
import App from '@layouts/index.vue';
import stores from '@stores/index';
import routes from '@routes/index';
import i18n from '@i18n/index';

createApp(App)
.use(stores)
.use(routes)
.use(i18n)
.mount('#app');