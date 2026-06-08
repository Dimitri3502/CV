import type {DragEvent} from 'react';
import type {CVData, CVTemplate, Locale} from '../cv-data';
import type {CvSectionKey, CvTemplatePageMargins, CvTemplateSectionPlacement} from '../cv-types';
import {
  getSectionLabel,
  getSectionPlacementKey,
  getSectionPlacementVariant,
  getSectionRenderVariantLabel,
  supportsSectionRenderVariant,
} from '../template-utils';
import {marginValueToInput, type EditorZoneKey} from './template-editor-model';

type TemplateSectionChipProps = {
  locale: Locale;
  data: CVData;
  section: CvTemplateSectionPlacement;
  zoneKey: EditorZoneKey;
  onDragStart: (event: DragEvent<HTMLElement>, sectionKey: CvSectionKey) => void;
  onItemDrop: (event: DragEvent<HTMLElement>, zoneKey: EditorZoneKey, beforeSectionKey: CvSectionKey) => void;
  onSectionClick: (sectionKey: CvSectionKey) => void;
};

type TemplateLayoutSettingsSectionProps = {
  locale: Locale;
  template: CVTemplate;
  onMarginChange: (field: keyof CvTemplatePageMargins, rawValue: string) => void;
  onThemeColorChange: (rawValue: string) => void;
};

type TemplateDropZoneProps = {
  locale: Locale;
  data: CVData;
  title: string;
  metaLabel: string;
  emptyLabel: string;
  sections: readonly CvTemplateSectionPlacement[];
  zoneKey: EditorZoneKey;
  onDragStart: (event: DragEvent<HTMLElement>, sectionKey: CvSectionKey) => void;
  onZoneDrop: (event: DragEvent<HTMLElement>, zoneKey: EditorZoneKey) => void;
  onItemDrop: (event: DragEvent<HTMLElement>, zoneKey: EditorZoneKey, beforeSectionKey: CvSectionKey) => void;
  onSectionClick: (sectionKey: CvSectionKey) => void;
};

type TemplateEditorActionsProps = {
  locale: Locale;
  isSaving: boolean;
  hasPreviewChanges: boolean;
  hasUnsavedChanges: boolean;
  onValidate: () => void;
  onSave: () => Promise<void>;
  onReset: () => void;
};

const pageMarginFields: ReadonlyArray<{key: keyof CvTemplatePageMargins; label: Record<Locale, string>}> = [
  {key: 'top', label: {fr: 'Haut', en: 'Top'}},
  {key: 'bottom', label: {fr: 'Bas', en: 'Bottom'}},
  {key: 'mainHorizontal', label: {fr: 'Horizontal principal', en: 'Main horizontal'}},
  {key: 'sidebarHorizontal', label: {fr: 'Horizontal sidebar', en: 'Sidebar horizontal'}},
];

function TemplateSectionChip({locale, data, section, zoneKey, onDragStart, onItemDrop, onSectionClick}: TemplateSectionChipProps) {
  const sectionKey = getSectionPlacementKey(section);
  const canToggleVariant = zoneKey !== 'unassigned' && supportsSectionRenderVariant(sectionKey);
  const variantLabel = getSectionRenderVariantLabel(locale === 'fr' ? 'fr' : 'en', getSectionPlacementVariant(section));

  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, sectionKey)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onItemDrop(event, zoneKey, sectionKey)}
      onClick={() => {
        if (canToggleVariant) {
          onSectionClick(sectionKey);
        }
      }}
      className={`rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm ${canToggleVariant ? 'cursor-pointer' : 'cursor-move'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span>{getSectionLabel(data, sectionKey, locale === 'fr' ? 'fr' : 'en')}</span>
        {canToggleVariant ? (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {variantLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function TemplateEditorHeader({locale, statusLabel}: {locale: Locale; statusLabel: string}) {
  return (
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
        {statusLabel}
      </span>
    </div>
  );
}

export function TemplateLayoutSettingsSection({
  locale,
  template,
  onMarginChange,
  onThemeColorChange,
}: TemplateLayoutSettingsSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="m-0 text-sm font-semibold uppercase tracking-wide text-slate-700">
          {locale === 'fr' ? 'Réglages layout' : 'Layout settings'}
        </h3>
        <span className="font-mono text-[11px] uppercase tracking-wide text-slate-400">{template.settings.themeColor}</span>
      </div>

      <label className="mb-3 flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {locale === 'fr' ? 'Couleur thème' : 'Theme color'}
        </span>
        <div className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 py-2">
          <input
            type="color"
            value={template.settings.themeColor}
            onChange={(event) => onThemeColorChange(event.target.value)}
            className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
          />
          <code className="text-sm text-slate-700">{template.settings.themeColor}</code>
        </div>
      </label>

      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {locale === 'fr' ? 'Marges' : 'Margins'}
        </span>
        <span className="text-[11px] uppercase tracking-wide text-slate-400">mm</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {pageMarginFields.map((field) => (
          <label key={field.key} className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{field.label[locale]}</span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={marginValueToInput(template.page.margins[field.key])}
              onChange={(event) => onMarginChange(field.key, event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-0 focus:border-slate-500"
            />
          </label>
        ))}
      </div>
    </section>
  );
}

export function TemplateDropZone({
  locale,
  data,
  title,
  metaLabel,
  emptyLabel,
  sections,
  zoneKey,
  onDragStart,
  onZoneDrop,
  onItemDrop,
  onSectionClick,
}: TemplateDropZoneProps) {
  return (
    <section
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onZoneDrop(event, zoneKey)}
      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="m-0 text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h3>
        <span className="text-[11px] uppercase tracking-wide text-slate-400">{metaLabel}</span>
      </div>
      <div className="min-h-14 space-y-2 rounded-lg border border-dashed border-slate-300 bg-white/70 p-2">
        {sections.length ? (
          sections.map((section) => (
            <TemplateSectionChip
              key={`${zoneKey}-${getSectionPlacementKey(section)}`}
              locale={locale}
              data={data}
              section={section}
              zoneKey={zoneKey}
              onDragStart={onDragStart}
              onItemDrop={onItemDrop}
              onSectionClick={onSectionClick}
            />
          ))
        ) : (
          <div className="px-1 py-2 text-xs text-slate-400">{emptyLabel}</div>
        )}
      </div>
    </section>
  );
}

export function TemplateSaveFeedback({feedback}: {feedback: {tone: 'success' | 'error'; message: string} | null}) {
  if (!feedback) {
    return null;
  }

  return (
    <div
      className={`mt-4 rounded-lg px-3 py-2 text-sm ${
        feedback.tone === 'error' ? 'bg-red-50 text-red-700 ring-1 ring-red-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
      }`}
    >
      {feedback.message}
    </div>
  );
}

export function TemplateEditorActions({
  locale,
  isSaving,
  hasPreviewChanges,
  hasUnsavedChanges,
  onValidate,
  onSave,
  onReset,
}: TemplateEditorActionsProps) {
  return (
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
  );
}
