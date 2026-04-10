const SUPPORTED_LOCALES = ['en', 'fr'];
const DEFAULT_LOCALE = 'fr';
const CV_PDF_FILENAME_PREFIX = 'dimitri-beubry-cv';
const API_GLOBAL_PREFIX = 'api/v1';

function isSupportedLocale(value) {
  return SUPPORTED_LOCALES.includes(value);
}

module.exports = {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  CV_PDF_FILENAME_PREFIX,
  API_GLOBAL_PREFIX,
  isSupportedLocale,
};
