import type {DragEvent} from 'react';
import type {CVData, CVTemplate, Locale} from '../cv-data';
import type {CvSectionKey, CvTemplatePageMargins, CvTemplateZoneKey} from '../cv-types';
import {allSectionKeys, cloneTemplate, getAvailableSectionKeys, templateZoneKeys, templatesEqual} from '../template-utils';

export type EditorZoneKey = CvTemplateZoneKey | 'unassigned';

type UseTemplateEditorModelArgs = {
  locale: Locale;
  data: CVData;
  draftTemplate: CVTemplate;
  appliedTemplate: CVTemplate;
  persistedTemplate: CVTemplate;
  isSaving: boolean;
  onTemplateChange: (template: CVTemplate) => void;
};

function readDraggedSection(event: DragEvent<HTMLElement>) {
  const draggedSectionKey = event.dataTransfer.getData('text/cv-section-key');
  return allSectionKeys.find((sectionKey) => sectionKey === draggedSectionKey) ?? null;
}

function getZoneOverflowLabel(locale: Locale, zoneKey: CvTemplateZoneKey, overflow: 'drop-tail' | 'paginate') {
  if (locale === 'fr') {
    return overflow === 'drop-tail' ? (zoneKey === 'otherPages.main' ? 'Paginé' : 'Masque ce qui dépasse') : 'Paginé';
  }

  return overflow === 'drop-tail' ? (zoneKey === 'otherPages.main' ? 'Paginate' : 'Hide overflow') : 'Paginate';
}

function getStatusLabel(locale: Locale, isSaving: boolean, hasPreviewChanges: boolean, hasUnsavedChanges: boolean) {
  if (isSaving) {
    return locale === 'fr' ? 'Sauvegarde' : 'Saving';
  }

  if (hasPreviewChanges) {
    return locale === 'fr' ? 'Brouillon' : 'Draft';
  }

  if (hasUnsavedChanges) {
    return locale === 'fr' ? 'À sauvegarder' : 'Unsaved';
  }

  return locale === 'fr' ? 'Enregistré' : 'Saved';
}

export function marginValueToInput(value: string) {
  const match = value.trim().match(/^([0-9]+(?:\.[0-9]+)?)mm$/i);
  return match?.[1] ?? '0';
}

function isThemeColor(value: string): value is CVTemplate['settings']['themeColor'] {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function toThemeColor(value: CVTemplate['settings']['themeColor']) {
  return value.trim() as CVTemplate['settings']['themeColor'];
}

export function useTemplateEditorModel({
  locale,
  data,
  draftTemplate,
  appliedTemplate,
  persistedTemplate,
  isSaving,
  onTemplateChange,
}: UseTemplateEditorModelArgs) {
  const availableSections = getAvailableSectionKeys(data);
  const assignedSections = new Set(templateZoneKeys.flatMap((zoneKey) => draftTemplate.zones[zoneKey]?.sections ?? []));
  const editableSections = allSectionKeys.filter((sectionKey) => availableSections.includes(sectionKey) || assignedSections.has(sectionKey));
  const unassignedSections = editableSections.filter((sectionKey) => !assignedSections.has(sectionKey));
  const hasPreviewChanges = !templatesEqual(draftTemplate, appliedTemplate);
  const hasUnsavedChanges = !templatesEqual(draftTemplate, persistedTemplate);

  function moveSection(sectionKey: CvSectionKey, targetZone: EditorZoneKey, beforeSectionKey?: CvSectionKey) {
    const nextTemplate = cloneTemplate(draftTemplate);

    for (const zoneKey of templateZoneKeys) {
      const zone = nextTemplate.zones[zoneKey];
      if (zone) {
        zone.sections = zone.sections.filter((currentSectionKey) => currentSectionKey !== sectionKey);
      }
    }

    if (targetZone !== 'unassigned') {
      const zone = nextTemplate.zones[targetZone];
      if (zone) {
        const nextSections = [...zone.sections];
        const beforeIndex = beforeSectionKey ? nextSections.indexOf(beforeSectionKey) : -1;
        if (beforeIndex >= 0) {
          nextSections.splice(beforeIndex, 0, sectionKey);
        } else {
          nextSections.push(sectionKey);
        }
        zone.sections = nextSections;
      }
    }

    onTemplateChange(nextTemplate);
  }

  function handleDragStart(event: DragEvent<HTMLElement>, sectionKey: CvSectionKey) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/cv-section-key', sectionKey);
  }

  function handleZoneDrop(event: DragEvent<HTMLElement>, zoneKey: EditorZoneKey) {
    event.preventDefault();
    const draggedSectionKey = readDraggedSection(event);
    if (draggedSectionKey) {
      moveSection(draggedSectionKey, zoneKey);
    }
  }

  function handleItemDrop(event: DragEvent<HTMLElement>, zoneKey: EditorZoneKey, beforeSectionKey: CvSectionKey) {
    event.preventDefault();
    event.stopPropagation();
    const draggedSectionKey = readDraggedSection(event);
    if (draggedSectionKey && draggedSectionKey !== beforeSectionKey) {
      moveSection(draggedSectionKey, zoneKey, beforeSectionKey);
    }
  }

  function updatePageMargin(field: keyof CvTemplatePageMargins, rawValue: string) {
    const nextTemplate = cloneTemplate(draftTemplate);
    nextTemplate.page.margins[field] = rawValue.trim() === '' ? '0mm' : `${rawValue}mm`;
    onTemplateChange(nextTemplate);
  }

  function updateThemeColor(rawValue: string) {
    const nextTemplate = cloneTemplate(draftTemplate);
    nextTemplate.settings.themeColor = isThemeColor(rawValue) ? toThemeColor(rawValue) : persistedTemplate.settings.themeColor;
    onTemplateChange(nextTemplate);
  }

  return {
    hasPreviewChanges,
    hasUnsavedChanges,
    statusLabel: getStatusLabel(locale, isSaving, hasPreviewChanges, hasUnsavedChanges),
    unassignedSections,
    getZoneOverflowLabel: (zoneKey: CvTemplateZoneKey, overflow: 'drop-tail' | 'paginate') =>
      getZoneOverflowLabel(locale, zoneKey, overflow),
    handleDragStart,
    handleZoneDrop,
    handleItemDrop,
    updatePageMargin,
    updateThemeColor,
  };
}
