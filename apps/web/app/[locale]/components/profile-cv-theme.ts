import {resolveCvTheme} from '@cv/common';
import type {CSSProperties} from 'react';
import {allSectionKeys, getSectionPlacementKey, templateZoneKeys} from '../template-utils';
import type {CvSectionKey, CvTemplateZoneKey, NormalizedCvTemplate} from '../cv-types';

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function parseHexColor(value: string): RgbColor | null {
  const normalizedValue = value.trim().replace(/^#/, '');

  if (/^[0-9a-fA-F]{3}$/.test(normalizedValue)) {
    return {
      r: Number.parseInt(`${normalizedValue[0]}${normalizedValue[0]}`, 16),
      g: Number.parseInt(`${normalizedValue[1]}${normalizedValue[1]}`, 16),
      b: Number.parseInt(`${normalizedValue[2]}${normalizedValue[2]}`, 16),
    };
  }

  if (/^[0-9a-fA-F]{6}$/.test(normalizedValue)) {
    return {
      r: Number.parseInt(normalizedValue.slice(0, 2), 16),
      g: Number.parseInt(normalizedValue.slice(2, 4), 16),
      b: Number.parseInt(normalizedValue.slice(4, 6), 16),
    };
  }

  return null;
}

function parseRgbColor(value: string): (RgbColor & {a: number}) | null {
  const match = value
    .trim()
    .match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);

  if (!match) {
    return null;
  }

  return {
    r: clampChannel(Number.parseFloat(match[1])),
    g: clampChannel(Number.parseFloat(match[2])),
    b: clampChannel(Number.parseFloat(match[3])),
    a: match[4] ? Math.max(0, Math.min(1, Number.parseFloat(match[4]))) : 1,
  };
}

function toOpaqueColor(foreground: string, background: string): string {
  const foregroundHex = parseHexColor(foreground);
  const foregroundRgb = parseRgbColor(foreground);
  const backgroundHex = parseHexColor(background);
  const backgroundRgb = parseRgbColor(background);

  if (foregroundHex && backgroundHex) {
    return `rgb(${foregroundHex.r}, ${foregroundHex.g}, ${foregroundHex.b})`;
  }

  if (foregroundRgb && backgroundHex) {
    const alpha = foregroundRgb.a;
    const r = clampChannel(foregroundRgb.r * alpha + backgroundHex.r * (1 - alpha));
    const g = clampChannel(foregroundRgb.g * alpha + backgroundHex.g * (1 - alpha));
    const b = clampChannel(foregroundRgb.b * alpha + backgroundHex.b * (1 - alpha));
    return `rgb(${r}, ${g}, ${b})`;
  }

  if (foregroundHex && backgroundRgb) {
    return `rgb(${foregroundHex.r}, ${foregroundHex.g}, ${foregroundHex.b})`;
  }

  return foreground;
}

export function buildProfileCvThemeStyles(template: NormalizedCvTemplate) {
  const theme = resolveCvTheme(template.settings.themeColor);
  const themeColor = theme.themeColor;
  const themeStyles = {
    '--color-bg-light': theme.pageBg,
    '--color-bg-dark': theme.sidebarBg,
    '--color-text-light': '#F0F0F0',
    '--color-text-accent': themeColor,
    '--color-highlight': '#FFFFFF',
    '--cv-muted': theme.mutedText,
    '--cv-sidebar-kicker': toOpaqueColor(theme.sidebarKicker, theme.sidebarBg),
    '--cv-sidebar-divider': toOpaqueColor(theme.sidebarDivider, theme.sidebarBg),
    '--cv-tag-bg': toOpaqueColor(theme.tagBg, theme.sidebarBg),
    '--cv-tag-border': toOpaqueColor(theme.tagBorder, theme.sidebarBg),
    '--cv-tag-text': theme.tagText,
    '--cv-card-bg': toOpaqueColor(theme.cardBg, theme.pageBg),
    '--cv-card-bg-strong': toOpaqueColor(theme.cardBgStrong, theme.pageBg),
    '--cv-card-border': toOpaqueColor(theme.cardBorder, theme.pageBg),
    '--cv-accent-soft': toOpaqueColor(theme.cardBgStrong, theme.pageBg),
    '--cv-print-page-top-padding': template.page.margins.top,
    '--cv-print-page-bottom-padding': template.page.margins.bottom,
    '--cv-print-page-side-padding': template.page.margins.mainHorizontal,
    '--cv-print-sidebar-side-padding': template.page.margins.sidebarHorizontal,
    '--print-sidebar-gap': template.page.margins.mainHorizontal,
  } as CSSProperties;

  return {themeColor, themeStyles};
}

export function resolveZoneConfig(template: NormalizedCvTemplate, zone: CvTemplateZoneKey) {
  return template.zones[zone] ?? {
    overflow: zone === 'otherPages.main' ? 'paginate' : 'drop-tail',
    sections: [],
  };
}

export function resolveZoneOverflowClass(overflow: 'drop-tail' | 'paginate') {
  return overflow === 'drop-tail' ? 'cv-zone-drop-tail' : 'cv-zone-paginate';
}

export function validateTemplateSections(template: NormalizedCvTemplate) {
  const validSectionKeys = new Set<CvSectionKey>(allSectionKeys);
  const seenSections = new Set<CvSectionKey>();

  for (const zone of templateZoneKeys) {
    const zoneConfig = resolveZoneConfig(template, zone);

    for (const placement of zoneConfig.sections) {
      const section = getSectionPlacementKey(placement);

      if (!validSectionKeys.has(section)) {
        throw new Error(`Unknown section key "${String(section)}" in template "${template.id}"`);
      }

      if (seenSections.has(section)) {
        throw new Error(`Section "${section}" is declared more than once in template "${template.id}"`);
      }

      seenSections.add(section);
    }
  }
}
