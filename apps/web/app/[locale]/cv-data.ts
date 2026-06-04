import {
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type Locale,
} from '@cv/common';
import enMessages from '../../messages/en.json';
import frMessages from '../../messages/fr.json';
import {tatianaFrCv} from './profiles/tatiana-fr';
import type {LocaleLink, PolicyCvData} from './cv-types';

export const locales = SUPPORTED_LOCALES;
export type {Locale, LocaleLink};
export type ClassicCvData = typeof frMessages;
export type CVData = ClassicCvData | PolicyCvData;

type ProfileDefinition = {
  slug: string;
  dataByLocale: Partial<Record<Locale, CVData>>;
};

type ResolvedProfile = {
  slug: string;
  locale: Locale;
  data: CVData;
};

const profiles: ProfileDefinition[] = [
  {
    slug: 'dimitri-beubry',
    dataByLocale: {
      fr: frMessages,
      en: enMessages,
    },
  },
  {
    slug: tatianaFrCv.Meta.slug,
    dataByLocale: {
      fr: tatianaFrCv,
    },
  },
];

const defaultProfileSlugByLocale: Record<Locale, string> = {
  fr: 'dimitri-beubry',
  en: 'dimitri-beubry',
};

const profilesBySlug = new Map(profiles.map((profile) => [profile.slug, profile]));

export function isLocale(value: string): value is Locale {
  return isSupportedLocale(value);
}

export function getDefaultProfile(locale: Locale): ResolvedProfile {
  return getProfileOrThrow(locale, defaultProfileSlugByLocale[locale]);
}

export function getProfile(locale: Locale, slug: string): ResolvedProfile | null {
  const profile = profilesBySlug.get(slug);
  const data = profile?.dataByLocale[locale];

  if (!profile || !data) {
    return null;
  }

  return {
    slug: profile.slug,
    locale,
    data,
  };
}

export function getAvailableLocaleLinks(slug: string): LocaleLink[] {
  const profile = profilesBySlug.get(slug);
  if (!profile) {
    return [];
  }

  return locales
    .filter((locale) => profile.dataByLocale[locale])
    .map((locale) => ({
      locale,
      href: buildProfileHref(locale, slug),
    }));
}

export function buildProfileHref(locale: Locale, slug: string): string {
  return defaultProfileSlugByLocale[locale] === slug ? `/${locale}` : `/${locale}/${slug}`;
}

export function buildPrintHref(locale: Locale, slug: string): string {
  return defaultProfileSlugByLocale[locale] === slug
    ? `/${locale}/print`
    : `/${locale}/${slug}/print`;
}

export function getProfileTitle(data: CVData): string {
  return data.Header.name;
}

export function isPolicyCvData(data: CVData): data is PolicyCvData {
  return data.Meta.template === 'policy';
}

export function getStaticProfileParams() {
  return profiles.flatMap((profile) =>
    locales
      .filter((locale) => profile.dataByLocale[locale])
      .map((locale) => ({locale, profile: profile.slug})),
  );
}

function getProfileOrThrow(locale: Locale, slug: string): ResolvedProfile {
  const profile = getProfile(locale, slug);
  if (!profile) {
    throw new Error(`Profile not available for ${locale}:${slug}`);
  }
  return profile;
}
