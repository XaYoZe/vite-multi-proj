import { createI18n } from 'vue-i18n';
import { getLang } from 'UTILS';
import langEn from './locale/en';
import langHi from './locale/hi';

const i18n = createI18n({
  legacy: false,
  locale: getLang(),
  fallbackLocale: 'en',
  messages: {
    en: langEn,
    hi: langHi
  }
});
document.title = i18n.global.t('home.title');

export default i18n;

