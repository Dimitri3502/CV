'use client';

import type {CVData, CVTemplate, Locale} from '../cv-data';
import {templateZoneKeys, templateZoneLabels} from '../template-utils';
import {
  TemplateDropZone,
  TemplateEditorActions,
  TemplateEditorHeader,
  TemplateLayoutSettingsSection,
  TemplateSaveFeedback,
} from './TemplateEditorParts';
import {useTemplateEditorModel} from './template-editor-model';

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

export function CVTemplateEditor(props: CVTemplateEditorProps) {
  const model = useTemplateEditorModel(props);

  return (
    <aside className="w-full rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-slate-200 lg:sticky lg:top-6">
      <TemplateEditorHeader locale={props.locale} statusLabel={model.statusLabel} />

      <div className="space-y-4">
        <TemplateLayoutSettingsSection
          locale={props.locale}
          template={props.draftTemplate}
          onMarginChange={model.updatePageMargin}
          onThemeColorChange={model.updateThemeColor}
        />

        {templateZoneKeys.map((zoneKey) => (
          <TemplateDropZone
            key={zoneKey}
            locale={props.locale}
            data={props.data}
            title={templateZoneLabels[zoneKey][props.locale === 'fr' ? 'fr' : 'en']}
            metaLabel={model.getZoneOverflowLabel(zoneKey, props.draftTemplate.zones[zoneKey]?.overflow ?? (zoneKey === 'otherPages.main' ? 'paginate' : 'drop-tail'))}
            emptyLabel={props.locale === 'fr' ? 'Déposez des sections ici' : 'Drop sections here'}
            sectionKeys={props.draftTemplate.zones[zoneKey]?.sections ?? []}
            zoneKey={zoneKey}
            onDragStart={model.handleDragStart}
            onZoneDrop={model.handleZoneDrop}
            onItemDrop={model.handleItemDrop}
          />
        ))}

        <TemplateDropZone
          locale={props.locale}
          data={props.data}
          title={props.locale === 'fr' ? 'Non assigné' : 'Unassigned'}
          metaLabel={props.locale === 'fr' ? 'Masqué du print' : 'Hidden from print'}
          emptyLabel={props.locale === 'fr' ? 'Toutes les sections sont placées' : 'All sections are placed'}
          sectionKeys={model.unassignedSections}
          zoneKey="unassigned"
          onDragStart={model.handleDragStart}
          onZoneDrop={model.handleZoneDrop}
          onItemDrop={model.handleItemDrop}
        />
      </div>

      <TemplateSaveFeedback feedback={props.saveFeedback} />
      <TemplateEditorActions
        locale={props.locale}
        isSaving={props.isSaving}
        hasPreviewChanges={model.hasPreviewChanges}
        hasUnsavedChanges={model.hasUnsavedChanges}
        onValidate={props.onValidate}
        onSave={props.onSave}
        onReset={props.onReset}
      />
    </aside>
  );
}
