import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import id from './locales/id.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: { translation: id },
      en: { translation: en },
    },
    lng: localStorage.getItem('portfolio_lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'portfolio_lang',
      caches: ['localStorage'],
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language || 'en';
}

export default i18n;
