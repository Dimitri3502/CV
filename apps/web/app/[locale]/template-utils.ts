import type {
  CvTemplateSettings,
  CvTemplatePageMargins,
  CvSectionKey,
  CvTemplateZoneKey,
  CvZoneOverflowPolicy,
  NormalizedCvDocument,
  NormalizedCvTemplate,
} from './cv-types';

export const templateZoneKeys: readonly CvTemplateZoneKey[] = ['firstPage.left', 'firstPage.right', 'otherPages.main'];
export const allSectionKeys: readonly CvSectionKey[] = [
  'photo',
  'contact',
  'header',
  'profile',
  'expertise',
  'languages',
  'education',
  'certifications',
  'experience',
  'publications',
  'interventions',
  'engagements',
];

export const templateZoneLabels: Record<CvTemplateZoneKey, {fr: string; en: string}> = {
  'firstPage.left': {fr: 'Page 1 · Gauche', en: 'Page 1 · Left'},
  'firstPage.right': {fr: 'Page 1 · Droite', en: 'Page 1 · Right'},
  'otherPages.main': {fr: 'Pages suivantes', en: 'Other pages'},
};

const defaultSectionLabels: Record<CvSectionKey, {fr: string; en: string}> = {
  photo: {fr: 'Photo', en: 'Photo'},
  contact: {fr: 'Contact', en: 'Contact'},
  header: {fr: 'En-tête', en: 'Header'},
  profile: {fr: 'Profil', en: 'Profile'},
  expertise: {fr: 'Compétences', en: 'Skills'},
  languages: {fr: 'Langues', en: 'Languages'},
  education: {fr: 'Formation', en: 'Education'},
  certifications: {fr: 'Certifications', en: 'Certifications'},
  experience: {fr: 'Expériences', en: 'Experience'},
  publications: {fr: 'Publications', en: 'Publications'},
  interventions: {fr: 'Interventions', en: 'Talks'},
  engagements: {fr: 'Engagements', en: 'Engagements'},
};

function isTemplateLength(value: unknown): value is string {
  return typeof value === 'string' && /^(?:0|[0-9]+(?:\.[0-9]+)?(?:mm|cm|in|pt|px|rem|em))$/i.test(value.trim());
}

function isSectionKey(value: unknown): value is CvSectionKey {
  return typeof value === 'string' && allSectionKeys.includes(value as CvSectionKey);
}

function isZoneOverflowPolicy(value: unknown): value is CvZoneOverflowPolicy {
  return value === 'drop-tail' || value === 'paginate';
}

function isThemeColor(value: unknown): value is CvTemplateSettings['themeColor'] {
  return typeof value === 'string' && /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function toThemeColor(value: CvTemplateSettings['themeColor']) {
  return value.trim() as CvTemplateSettings['themeColor'];
}

function cloneZoneSections(value: readonly CvSectionKey[]) {
  return [...value] as CvSectionKey[];
}

function clonePageMargins(value: CvTemplatePageMargins): CvTemplatePageMargins {
  return {
    top: value.top,
    bottom: value.bottom,
    mainHorizontal: value.mainHorizontal,
    sidebarHorizontal: value.sidebarHorizontal,
  };
}

function cloneTemplateSettings(value: CvTemplateSettings): CvTemplateSettings {
  return {
    themeColor: value.themeColor,
  };
}

export function cloneTemplate(template: NormalizedCvTemplate): NormalizedCvTemplate {
  return {
    version: 1,
    id: template.id,
    settings: cloneTemplateSettings(template.settings),
    page: {
      size: template.page.size,
      orientation: template.page.orientation,
      margins: clonePageMargins(template.page.margins),
    },
    zones: Object.fromEntries(
      templateZoneKeys
        .filter((zoneKey) => template.zones[zoneKey])
        .map((zoneKey) => [
          zoneKey,
          {
            overflow: template.zones[zoneKey]!.overflow,
            sections: cloneZoneSections(template.zones[zoneKey]!.sections),
          },
        ]),
    ) as NormalizedCvTemplate['zones'],
  };
}

export function templatesEqual(left: NormalizedCvTemplate, right: NormalizedCvTemplate) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function normalizeTemplate(template: unknown, fallback: NormalizedCvTemplate): NormalizedCvTemplate {
  const safeFallback = cloneTemplate(fallback);

  if (!template || typeof template !== 'object' || Array.isArray(template)) {
    return safeFallback;
  }

  const input = template as {
    id?: unknown;
    settings?: {
      themeColor?: unknown;
    };
    page?: {
      size?: unknown;
      orientation?: unknown;
      margins?: Partial<Record<keyof CvTemplatePageMargins, unknown>>;
    };
    zones?: Partial<Record<CvTemplateZoneKey, {overflow?: unknown; sections?: unknown}>>;
  };

  const normalizedZones = Object.fromEntries(
    templateZoneKeys.map((zoneKey) => {
      const fallbackZone = safeFallback.zones[zoneKey] ?? {
        overflow: zoneKey === 'otherPages.main' ? 'paginate' : 'drop-tail',
        sections: [] as readonly CvSectionKey[],
      };
      const inputZone = input.zones?.[zoneKey];
      const overflow = isZoneOverflowPolicy(inputZone?.overflow) ? inputZone.overflow : fallbackZone.overflow;
      const sections = Array.isArray(inputZone?.sections)
        ? inputZone.sections.filter(isSectionKey)
        : cloneZoneSections(fallbackZone.sections);

      return [
        zoneKey,
        {
          overflow,
          sections,
        },
      ];
    }),
  ) as NormalizedCvTemplate['zones'];

  const seenSections = new Set<CvSectionKey>();
  for (const zoneKey of templateZoneKeys) {
    normalizedZones[zoneKey]!.sections = normalizedZones[zoneKey]!.sections.filter((sectionKey) => {
      if (seenSections.has(sectionKey)) {
        return false;
      }
      seenSections.add(sectionKey);
      return true;
    });
  }

  return {
    version: 1,
    id: typeof input.id === 'string' && input.id.trim() ? input.id : safeFallback.id,
    settings: {
      themeColor: isThemeColor(input.settings?.themeColor)
        ? toThemeColor(input.settings.themeColor)
        : safeFallback.settings.themeColor,
    },
    page: {
      size: input.page?.size === 'A4' ? 'A4' : safeFallback.page.size,
      orientation: input.page?.orientation === 'portrait' ? 'portrait' : safeFallback.page.orientation,
      margins: {
        top: isTemplateLength(input.page?.margins?.top) ? input.page.margins.top.trim() : safeFallback.page.margins.top,
        bottom: isTemplateLength(input.page?.margins?.bottom)
          ? input.page.margins.bottom.trim()
          : safeFallback.page.margins.bottom,
        mainHorizontal: isTemplateLength(input.page?.margins?.mainHorizontal)
          ? input.page.margins.mainHorizontal.trim()
          : safeFallback.page.margins.mainHorizontal,
        sidebarHorizontal: isTemplateLength(input.page?.margins?.sidebarHorizontal)
          ? input.page.margins.sidebarHorizontal.trim()
          : safeFallback.page.margins.sidebarHorizontal,
      },
    },
    zones: normalizedZones,
  };
}

export function parseTemplateOverride(
  rawTemplate: string | string[] | undefined,
  fallback: NormalizedCvTemplate,
): NormalizedCvTemplate {
  if (!rawTemplate || Array.isArray(rawTemplate)) {
    return cloneTemplate(fallback);
  }

  try {
    const parsedTemplate = JSON.parse(rawTemplate) as unknown;
    return normalizeTemplate(parsedTemplate, fallback);
  } catch {
    return cloneTemplate(fallback);
  }
}

export function buildPrintPathWithTemplate(printPath: string, template: NormalizedCvTemplate, fallback: NormalizedCvTemplate) {
  if (templatesEqual(template, fallback)) {
    return printPath;
  }

  const resolvedUrl = new URL(printPath, 'http://localhost');
  resolvedUrl.searchParams.set('template', JSON.stringify(template));
  return `${resolvedUrl.pathname}${resolvedUrl.search}`;
}

export function getSectionLabel(
  data: NormalizedCvDocument,
  sectionKey: CvSectionKey,
  locale: 'fr' | 'en',
) {
  switch (sectionKey) {
    case 'contact':
      return data.contact?.title ?? defaultSectionLabels.contact[locale];
    case 'profile':
      return data.profile?.title ?? defaultSectionLabels.profile[locale];
    case 'expertise':
      return data.expertise?.title ?? defaultSectionLabels.expertise[locale];
    case 'languages':
      return data.languages?.title ?? defaultSectionLabels.languages[locale];
    case 'education':
      return data.education?.title ?? defaultSectionLabels.education[locale];
    case 'certifications':
      return data.certifications?.title ?? defaultSectionLabels.certifications[locale];
    case 'experience':
      return data.experience?.title ?? defaultSectionLabels.experience[locale];
    case 'publications':
      return data.publications?.title ?? defaultSectionLabels.publications[locale];
    case 'interventions':
      return data.interventions?.title ?? defaultSectionLabels.interventions[locale];
    case 'engagements':
      return data.engagements?.title ?? defaultSectionLabels.engagements[locale];
    default:
      return defaultSectionLabels[sectionKey][locale];
  }
}

export function getAvailableSectionKeys(data: NormalizedCvDocument): CvSectionKey[] {
  const availableSections: CvSectionKey[] = ['header'];

  if (data.contact?.photoUrl?.trim()) {
    availableSections.push('photo');
  }
  if (data.contact) {
    availableSections.push('contact');
  }
  if (data.profile) {
    availableSections.push('profile');
  }
  if (data.expertise) {
    availableSections.push('expertise');
  }
  if (data.languages) {
    availableSections.push('languages');
  }
  if (data.education) {
    availableSections.push('education');
  }
  if (data.certifications) {
    availableSections.push('certifications');
  }
  if (data.experience) {
    availableSections.push('experience');
  }
  if (data.publications) {
    availableSections.push('publications');
  }
  if (data.interventions) {
    availableSections.push('interventions');
  }
  if (data.engagements) {
    availableSections.push('engagements');
  }

  return availableSections;
}
