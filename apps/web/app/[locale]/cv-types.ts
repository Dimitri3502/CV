import type {CvThemeColor, Locale} from '@cv/common';

export type LocaleLink = {
  locale: Locale;
  href: string;
};

export type NormalizedContactItem =
  | {kind: 'email'; icon: CvIconKey; value: string}
  | {kind: 'phone'; icon: CvIconKey; value: string}
  | {kind: 'location'; icon: CvIconKey; value: string}
  | {kind: 'linkedin'; icon: CvIconKey; value: string; url: string}
  | {kind: 'calendly'; icon: CvIconKey; value: string; url: string}
  | {kind: 'link'; icon: CvIconKey; value: string; url: string};

export type NormalizedCvSectionTitle = {
  title: string;
  icon?: CvIconKey;
};

export type NormalizedCvSimpleEntry = {
  title: string;
  subtitle?: string;
  period?: string;
};

export type NormalizedCvSimpleEntrySection = NormalizedCvSectionTitle & {
  subtitle?: string;
  items: ReadonlyArray<NormalizedCvSimpleEntry>;
};

export type CvTemplateZoneKey = 'firstPage.left' | 'firstPage.right' | 'otherPages.main';

export type CvSectionKey =
  | 'photo'
  | 'contact'
  | 'header'
  | 'profile'
  | 'expertise'
  | 'languages'
  | 'education'
  | 'certifications'
  | 'experience'
  | 'publications'
  | 'interventions'
  | 'engagements';

export type CvZoneOverflowPolicy = 'drop-tail' | 'paginate';

export type CvSectionRenderVariant = 'default' | 'compact';

export type CvIconKey =
  | 'address-book'
  | 'chart-line'
  | 'calendar-days'
  | 'certificate'
  | 'envelope'
  | 'globe'
  | 'graduation-cap'
  | 'link'
  | 'people-group'
  | 'laptop-code'
  | 'location-dot'
  | 'phone'
  | 'brain'
  | 'database'
  | 'gears'
  | 'briefcase'
  | 'bullseye';

export type CvTemplatePageMargins = {
  top: string;
  bottom: string;
  mainHorizontal: string;
  sidebarHorizontal: string;
};

export type CvTemplateSettings = {
  themeColor: CvThemeColor;
};

export type CvTemplateSectionPlacement =
  | CvSectionKey
  | {
      key: CvSectionKey;
      variant?: CvSectionRenderVariant;
    };

export type NormalizedCvTemplate = {
  version: 1;
  id: string;
  settings: CvTemplateSettings;
  page: {
    size: 'A4';
    orientation: 'portrait';
    margins: CvTemplatePageMargins;
  };
  zones: Partial<Record<CvTemplateZoneKey, {
    overflow: CvZoneOverflowPolicy;
    sections: readonly CvTemplateSectionPlacement[];
  }>>;
};

export type NormalizedCvDocument = {
  meta: {
    slug: string;
    filenameBase: string;
    locale: Locale;
    availableLocales: readonly Locale[];
    themeColor?: CvThemeColor;
    templateId: string;
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
      icon?: CvIconKey;
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
  certifications?: NormalizedCvSimpleEntrySection;
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
  publications?: NormalizedCvSimpleEntrySection;
  interventions?: NormalizedCvSimpleEntrySection;
  engagements?: NormalizedCvSimpleEntrySection;
};
