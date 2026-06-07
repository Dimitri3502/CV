import {
  SUPPORTED_LOCALES,
  isSupportedLocale,
  type Locale,
} from '@cv/common';
import dimitriEnProfileJson from './profiles/dimitri-en.json';
import dimitriFrProfileJson from './profiles/dimitri-fr.json';
import tatianaFrProfileJson from './profiles/tatiana-fr.json';
import type {LocaleLink, NormalizedCvDocument, NormalizedCvTemplate} from './cv-types';
import {templatesById} from './template-registry';

export const locales = SUPPORTED_LOCALES;
export type {Locale, LocaleLink};
export type CVData = NormalizedCvDocument;
export type CVTemplate = NormalizedCvTemplate;

const dimitriEnProfile = dimitriEnProfileJson as CVData;
const dimitriFrProfile = dimitriFrProfileJson as CVData;
const tatianaFrProfile = tatianaFrProfileJson as CVData;

type ProfileDefinition = {
  slug: string;
  dataByLocale: Partial<Record<Locale, CVData>>;
};

type ResolvedProfile = {
  slug: string;
  locale: Locale;
  data: CVData;
  template: CVTemplate;
};

const profiles: ProfileDefinition[] = [
  {
    slug: dimitriFrProfile.meta.slug,
    dataByLocale: {
      fr: dimitriFrProfile,
      en: dimitriEnProfile,
    },
  },
  {
    slug: tatianaFrProfile.meta.slug,
    dataByLocale: {
      fr: tatianaFrProfile,
    },
  },
];

const defaultProfileSlugByLocale: Record<Locale, string> = {
  fr: dimitriFrProfile.meta.slug,
  en: dimitriEnProfile.meta.slug,
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

  const template = templatesById.get(data.meta.templateId);
  if (!template) {
    throw new Error(`Template not available for ${data.meta.templateId}`);
  }

  return {
    slug: profile.slug,
    locale,
    data,
    template,
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
  return data.header.name;
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
