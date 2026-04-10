import {SUPPORTED_LOCALES, isSupportedLocale, type Locale as SharedLocale} from '@cv/common';
import enMessages from '../../messages/en.json';
import frMessages from '../../messages/fr.json';

export const locales = SUPPORTED_LOCALES;
export type Locale = SharedLocale;
export type CVMessages = typeof frMessages;

const messagesByLocale: Record<Locale, CVMessages> = {
  en: enMessages,
  fr: frMessages,
};

export function isLocale(value: string): value is Locale {
  return isSupportedLocale(value);
}

export function getMessages(locale: Locale): CVMessages {
  return messagesByLocale[locale];
}
