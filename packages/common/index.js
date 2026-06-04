const SUPPORTED_LOCALES = ['en', 'fr'];
const DEFAULT_LOCALE = 'fr';
const CV_PDF_FILENAME_PREFIX = 'dimitri-beubry-cv';
const API_GLOBAL_PREFIX = 'api/v1';
const DEFAULT_THEME_COLOR = '#424F64';

function isSupportedLocale(value) {
  return SUPPORTED_LOCALES.includes(value);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizeThemeColor(value) {
  if (typeof value !== 'string') {
    return DEFAULT_THEME_COLOR;
  }

  const trimmedValue = value.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(trimmedValue)) {
    const expandedValue = trimmedValue
      .split('')
      .map((char) => `${char}${char}`)
      .join('');
    return `#${expandedValue.toUpperCase()}`;
  }

  if (/^[0-9a-fA-F]{6}$/.test(trimmedValue)) {
    return `#${trimmedValue.toUpperCase()}`;
  }

  return DEFAULT_THEME_COLOR;
}

function hexToRgb(hexColor) {
  const normalizedColor = normalizeThemeColor(hexColor).slice(1);
  return {
    r: Number.parseInt(normalizedColor.slice(0, 2), 16),
    g: Number.parseInt(normalizedColor.slice(2, 4), 16),
    b: Number.parseInt(normalizedColor.slice(4, 6), 16),
  };
}

function rgbToRgbaString({r, g, b}, alpha) {
  return `rgba(${clamp(Math.round(r), 0, 255)}, ${clamp(Math.round(g), 0, 255)}, ${clamp(Math.round(b), 0, 255)}, ${alpha})`;
}

function isLightColor({r, g, b}) {
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness >= 176;
}

function resolveCvTheme(themeColor) {
  const normalizedThemeColor = normalizeThemeColor(themeColor);
  const themeRgb = hexToRgb(normalizedThemeColor);
  const usesDarkText = isLightColor(themeRgb);
  const sidebarText = usesDarkText ? '#393939' : '#F0F0F0';
  const sidebarTitle = usesDarkText ? '#393939' : '#FFFFFF';
  const accent = usesDarkText ? '#393939' : normalizedThemeColor;
  const overlayBase = usesDarkText ? {r: 57, g: 57, b: 57} : {r: 255, g: 255, b: 255};

  return {
    themeColor: normalizedThemeColor,
    sidebarBg: normalizedThemeColor,
    sidebarText,
    sidebarTitle,
    sidebarKicker: rgbToRgbaString(overlayBase, usesDarkText ? 0.68 : 0.72),
    sidebarDivider: rgbToRgbaString(overlayBase, usesDarkText ? 0.14 : 0.16),
    tagBg: rgbToRgbaString(overlayBase, usesDarkText ? 0.06 : 0.08),
    tagBorder: rgbToRgbaString(overlayBase, usesDarkText ? 0.18 : 0.2),
    tagText: sidebarText,
    accent,
    mutedText: '#575757',
    cardBg: rgbToRgbaString(themeRgb, usesDarkText ? 0.12 : 0.08),
    cardBgStrong: rgbToRgbaString(themeRgb, usesDarkText ? 0.18 : 0.12),
    cardBorder: rgbToRgbaString(themeRgb, usesDarkText ? 0.38 : 0.16),
    pageBg: '#FFFFFF',
  };
}

module.exports = {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  CV_PDF_FILENAME_PREFIX,
  API_GLOBAL_PREFIX,
  DEFAULT_THEME_COLOR,
  resolveCvTheme,
  isSupportedLocale,
};
