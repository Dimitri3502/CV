import type {CvThemeColor, Locale} from '@cv/common';

export type LocaleLink = {
  locale: Locale;
  href: string;
};

export type CvMeta = {
  template: 'classic' | 'policy';
  filenameBase: string;
  slug: string;
  themeColor?: CvThemeColor;
  availableLocales: readonly Locale[];
};

export type PolicyCvSectionTitle = {
  title: string;
};

export type PolicyCvData = {
  Meta: CvMeta & {template: 'policy'};
  Header: {
    name: string;
    subtitle: string;
  };
  Contact: PolicyCvSectionTitle & {
    email: string;
    phone: string;
    linkedinLabel: string;
    linkedinUrl: string;
    photoUrl?: string;
  };
  Profile: PolicyCvSectionTitle & {
    content: string;
  };
  Expertise: PolicyCvSectionTitle & {
    groups: ReadonlyArray<{
      title: string;
      items: readonly string[];
    }>;
  };
  Languages: PolicyCvSectionTitle & {
    items: readonly string[];
  };
  Education: PolicyCvSectionTitle & {
    items: ReadonlyArray<{
      degree: string;
      institution: string;
      period?: string;
      details?: readonly string[];
    }>;
  };
  Certifications: PolicyCvSectionTitle & {
    items: ReadonlyArray<{
      name: string;
      issuerLine: string;
    }>;
  };
  Experience: PolicyCvSectionTitle & {
    items: ReadonlyArray<{
      role: string;
      organization: string;
      period: string;
      location?: string;
      bullets: readonly string[];
    }>;
  };
  Interventions: PolicyCvSectionTitle & {
    items: ReadonlyArray<{
      title: string;
      meta: string;
    }>;
  };
  Publications: PolicyCvSectionTitle & {
    subtitle?: string;
    items: readonly string[];
  };
  Engagements: PolicyCvSectionTitle & {
    items: ReadonlyArray<{
      title: string;
      organization: string;
      period: string;
    }>;
  };
};
