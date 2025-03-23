import enTranslations from '../../messages/en/common.json';
import esTranslations from '../../messages/es/common.json';

const translations = {
  en: enTranslations,
  es: esTranslations,
};

export function getTranslation(locale) {
  return translations[locale] || translations['en'];
}

export function t(locale, key) {
  const translation = getTranslation(locale);
  return key.split('.').reduce((obj, k) => obj?.[k], translation) || key;
} 