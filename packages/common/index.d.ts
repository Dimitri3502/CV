export const SUPPORTED_LOCALES: readonly ['en', 'fr'];
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale;
export const CV_PDF_FILENAME_PREFIX: string;
export const API_GLOBAL_PREFIX: string;
export function isSupportedLocale(value: string): value is Locale;
