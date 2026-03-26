import enMessages from '../../messages/en.json';
import frMessages from '../../messages/fr.json';

export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export type CVMessages = typeof enMessages;

const messagesByLocale: Record<Locale, CVMessages> = {
  en: enMessages,
  fr: frMessages,
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getMessages(locale: Locale): CVMessages {
  return messagesByLocale[locale];
}
