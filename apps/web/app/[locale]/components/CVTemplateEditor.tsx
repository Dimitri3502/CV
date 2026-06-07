'use client';

import type {DragEvent} from 'react';
import type {CVData, CVTemplate, Locale} from '../cv-data';
import type {CvSectionKey, CvTemplatePageMargins, CvTemplateZoneKey} from '../cv-types';
import {
  allSectionKeys,
  cloneTemplate,
  getAvailableSectionKeys,
  getSectionLabel,
  templateZoneKeys,
  templateZoneLabels,
  templatesEqual,
} from '../template-utils';

type EditorZoneKey = CvTemplateZoneKey | 'unassigned';

type CVTemplateEditorProps = {
  locale: Locale;
  data: CVData;
  draftTemplate: CVTemplate;
  appliedTemplate: CVTemplate;
  persistedTemplate: CVTemplate;
  isSaving: boolean;
  saveFeedback: {tone: 'success' | 'error'; message: string} | null;
  onTemplateChange: (template: CVTemplate) => void;
  onValidate: () => void;
  onSave: () => Promise<void>;
  onReset: () => void;
};

const pageMarginFields: ReadonlyArray<{
  key: keyof CvTemplatePageMargins;
  label: Record<Locale, string>;
}> = [
  {
    key: 'top',
    label: {fr: 'Haut', en: 'Top'},
  },
  {
    key: 'bottom',
    label: {fr: 'Bas', en: 'Bottom'},
  },
  {
    key: 'mainHorizontal',
    label: {fr: 'Horizontal principal', en: 'Main horizontal'},
  },
  {
    key: 'sidebarHorizontal',
    label: {fr: 'Horizontal sidebar', en: 'Sidebar horizontal'},
  },
  {
    key: 'columnGap',
    label: {fr: 'Espace colonnes', en: 'Column gap'},
  },
];

function getZoneOverflowLabel(locale: Locale, zoneKey: CvTemplateZoneKey, overflow: 'drop-tail' | 'paginate') {
  if (locale === 'fr') {
    return overflow === 'drop-tail'
      ? zoneKey === 'otherPages.main'
        ? 'Paginé'
        : 'Masque ce qui dépasse'
      : 'Paginé';
  }

  return overflow === 'drop-tail'
    ? zoneKey === 'otherPages.main'
      ? 'Paginate'
      : 'Hide overflow'
    : 'Paginate';
}

function marginValueToInput(value: string) {
  const match = value.trim().match(/^([0-9]+(?:\.[0-9]+)?)mm$/i);
  return match?.[1] ?? '0';
}

export function CVTemplateEditor({
  locale,
  data,
  draftTemplate,
  appliedTemplate,
  persistedTemplate,
  isSaving,
  saveFeedback,
  onTemplateChange,
  onValidate,
  onSave,
  onReset,
}: CVTemplateEditorProps) {
  const availableSections = getAvailableSectionKeys(data);
  const assignedSections = new Set(templateZoneKeys.flatMap((zoneKey) => draftTemplate.zones[zoneKey]?.sections ?? []));
  const editableSections = allSectionKeys.filter((sectionKey) => availableSections.includes(sectionKey) || assignedSections.has(sectionKey));
  const unassignedSections = editableSections.filter((sectionKey) => !assignedSections.has(sectionKey));
  const hasPreviewChanges = !templatesEqual(draftTemplate, appliedTemplate);
  const hasUnsavedChanges = !templatesEqual(draftTemplate, persistedTemplate);

  function getStatusLabel() {
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

  function moveSection(sectionKey: CvSectionKey, targetZone: EditorZoneKey, beforeSectionKey?: CvSectionKey) {
    const nextTemplate = cloneTemplate(draftTemplate);

    for (const zoneKey of templateZoneKeys) {
      const zone = nextTemplate.zones[zoneKey];
      if (!zone) {
        continue;
      }
      zone.sections = zone.sections.filter((currentSectionKey) => currentSectionKey !== sectionKey);
    }

    if (targetZone !== 'unassigned') {
      const zone = nextTemplate.zones[targetZone];
      if (zone) {
        const nextSections = [...zone.sections];
        if (beforeSectionKey) {
          const beforeIndex = nextSections.indexOf(beforeSectionKey);
          if (beforeIndex >= 0) {
            nextSections.splice(beforeIndex, 0, sectionKey);
          } else {
            nextSections.push(sectionKey);
          }
        } else {
          nextSections.push(sectionKey);
        }
        zone.sections = nextSections;
      }
    }

    onTemplateChange(nextTemplate);
  }

  function readDraggedSection(event: DragEvent<HTMLElement>) {
    const draggedSectionKey = event.dataTransfer.getData('text/cv-section-key');
    return allSectionKeys.find((sectionKey) => sectionKey === draggedSectionKey) ?? null;
  }

  function handleDragStart(event: DragEvent<HTMLElement>, sectionKey: CvSectionKey) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/cv-section-key', sectionKey);
  }

  function handleZoneDrop(event: DragEvent<HTMLElement>, zoneKey: EditorZoneKey) {
    event.preventDefault();
    const draggedSectionKey = readDraggedSection(event);
    if (!draggedSectionKey) {
      return;
    }
    moveSection(draggedSectionKey, zoneKey);
  }

  function handleItemDrop(event: DragEvent<HTMLElement>, zoneKey: EditorZoneKey, beforeSectionKey: CvSectionKey) {
    event.preventDefault();
    event.stopPropagation();
    const draggedSectionKey = readDraggedSection(event);
    if (!draggedSectionKey || draggedSectionKey === beforeSectionKey) {
      return;
    }
    moveSection(draggedSectionKey, zoneKey, beforeSectionKey);
  }

  function updatePageMargin(field: keyof CvTemplatePageMargins, rawValue: string) {
    const nextValue = rawValue.trim() === '' ? '0mm' : `${rawValue}mm`;
    const nextTemplate = cloneTemplate(draftTemplate);
    nextTemplate.page.margins[field] = nextValue;
    onTemplateChange(nextTemplate);
  }

  function renderSectionChip(sectionKey: CvSectionKey, zoneKey: EditorZoneKey) {
    return (
      <div
        key={`${zoneKey}-${sectionKey}`}
        draggable
        onDragStart={(event) => handleDragStart(event, sectionKey)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => handleItemDrop(event, zoneKey, sectionKey)}
        className="cursor-move rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm"
      >
        {getSectionLabel(data, sectionKey, locale === 'fr' ? 'fr' : 'en')}
      </div>
    );
  }

  return (
    <aside className="w-full rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-slate-200 lg:sticky lg:top-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="m-0 text-lg font-semibold normal-case tracking-normal text-slate-900">
            {locale === 'fr' ? 'Template print' : 'Print template'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {locale === 'fr'
              ? 'Valider met à jour le PDF. Sauvegarder écrit directement le JSON du template.'
              : 'Apply updates the PDF. Save writes the template JSON to the repo.'}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {getStatusLabel()}
        </span>
      </div>

      <div className="space-y-4">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="m-0 text-sm font-semibold uppercase tracking-wide text-slate-700">
              {locale === 'fr' ? 'Marges' : 'Margins'}
            </h3>
            <span className="text-[11px] uppercase tracking-wide text-slate-400">mm</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {pageMarginFields.map((field) => (
              <label key={field.key} className="flex flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  {field.label[locale]}
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={marginValueToInput(draftTemplate.page.margins[field.key])}
                  onChange={(event) => updatePageMargin(field.key, event.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-slate-500"
                />
              </label>
            ))}
          </div>
        </section>

        {templateZoneKeys.map((zoneKey) => {
          const zone = draftTemplate.zones[zoneKey];
          const sections = zone?.sections ?? [];

          return (
            <section
              key={zoneKey}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleZoneDrop(event, zoneKey)}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="m-0 text-sm font-semibold uppercase tracking-wide text-slate-700">
                  {templateZoneLabels[zoneKey][locale === 'fr' ? 'fr' : 'en']}
                </h3>
                <span className="text-[11px] uppercase tracking-wide text-slate-400">
                  {getZoneOverflowLabel(locale, zoneKey, zone?.overflow ?? (zoneKey === 'otherPages.main' ? 'paginate' : 'drop-tail'))}
                </span>
              </div>
              <div className="min-h-14 space-y-2 rounded-lg border border-dashed border-slate-300 bg-white/70 p-2">
                {sections.length ? (
                  sections.map((sectionKey) => renderSectionChip(sectionKey, zoneKey))
                ) : (
                  <div className="px-1 py-2 text-xs text-slate-400">
                    {locale === 'fr' ? 'Déposez des sections ici' : 'Drop sections here'}
                  </div>
                )}
              </div>
            </section>
          );
        })}

        <section
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleZoneDrop(event, 'unassigned')}
          className="rounded-xl border border-slate-200 bg-slate-50 p-3"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="m-0 text-sm font-semibold uppercase tracking-wide text-slate-700">
              {locale === 'fr' ? 'Non assigné' : 'Unassigned'}
            </h3>
            <span className="text-[11px] uppercase tracking-wide text-slate-400">
              {locale === 'fr' ? 'Masqué du print' : 'Hidden from print'}
            </span>
          </div>
          <div className="min-h-14 space-y-2 rounded-lg border border-dashed border-slate-300 bg-white/70 p-2">
            {unassignedSections.length ? (
              unassignedSections.map((sectionKey) => renderSectionChip(sectionKey, 'unassigned'))
            ) : (
              <div className="px-1 py-2 text-xs text-slate-400">
                {locale === 'fr' ? 'Toutes les sections sont placées' : 'All sections are placed'}
              </div>
            )}
          </div>
        </section>
      </div>

      {saveFeedback ? (
        <div
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            saveFeedback.tone === 'error'
              ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
              : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
          }`}
        >
          {saveFeedback.message}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onValidate}
          disabled={!hasPreviewChanges}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {locale === 'fr' ? 'Valider' : 'Apply'}
        </button>
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={!hasUnsavedChanges || isSaving}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-emerald-200"
        >
          {isSaving ? (locale === 'fr' ? 'Sauvegarde...' : 'Saving...') : locale === 'fr' ? 'Sauvegarder' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={!hasPreviewChanges || isSaving}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
        >
          {locale === 'fr' ? 'Annuler' : 'Reset'}
        </button>
      </div>
    </aside>
  );
}
