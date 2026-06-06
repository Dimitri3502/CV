import type {CvThemeColor, Locale} from '@cv/common';

export type LocaleLink = {
  locale: Locale;
  href: string;
};

export type NormalizedContactItem =
  | {kind: 'email'; value: string}
  | {kind: 'phone'; value: string}
  | {kind: 'location'; value: string}
  | {kind: 'linkedin'; value: string; url: string}
  | {kind: 'calendly'; value: string; url: string}
  | {kind: 'link'; value: string; url: string};

export type NormalizedCvSectionTitle = {
  title: string;
};

export type NormalizedCvDocument = {
  meta: {
    slug: string;
    filenameBase: string;
    locale: Locale;
    availableLocales: readonly Locale[];
    themeColor: CvThemeColor;
  };
  header: {
    name: string;
    subtitle: string;
  };
  contact?: NormalizedCvSectionTitle & {
    photoUrl?: string;
    items: readonly NormalizedContactItem[];
  };
  profile?: NormalizedCvSectionTitle & {
    content?: string;
    highlights?: readonly string[];
  };
  expertise?: NormalizedCvSectionTitle & {
    groups: ReadonlyArray<{
      title: string;
      items: readonly string[];
    }>;
  };
  languages?: NormalizedCvSectionTitle & {
    items: readonly string[];
  };
  education?: NormalizedCvSectionTitle & {
    items: ReadonlyArray<{
      degree: string;
      institution: string;
      period?: string;
      details?: readonly string[];
    }>;
  };
  certifications?: NormalizedCvSectionTitle & {
    items: ReadonlyArray<{
      name: string;
      issuerLine?: string;
    }>;
  };
  experience?: NormalizedCvSectionTitle & {
    items: ReadonlyArray<{
      role: string;
      organization: string;
      location?: string;
      period?: string;
      summary?: string;
      bullets?: readonly string[];
    }>;
  };
  publications?: NormalizedCvSectionTitle & {
    subtitle?: string;
    items: ReadonlyArray<{
      text: string;
    }>;
  };
  interventions?: NormalizedCvSectionTitle & {
    items: ReadonlyArray<{
      title: string;
      meta?: string;
    }>;
  };
  engagements?: NormalizedCvSectionTitle & {
    items: ReadonlyArray<{
      title: string;
      organization: string;
      period?: string;
    }>;
  };
};
