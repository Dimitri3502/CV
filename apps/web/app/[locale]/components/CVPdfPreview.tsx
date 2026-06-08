'use client';

import type {CVData, CVTemplate, Locale} from '../cv-data';
import type {LocaleLink} from '../cv-types';
import {CVTemplateEditor} from './CVTemplateEditor';
import {CVPdfPreviewFrame} from './CVPdfPreviewFrame';
import {CVToolbar} from './CVToolbar';
import {useCvPdfPreview} from './use-cv-pdf-preview';

type CVPdfPreviewProps = {
  locale: Locale;
  data: CVData;
  template: CVTemplate;
  languageLinks: LocaleLink[];
  profileSlug: string;
};

export function CVPdfPreview({locale, data, template, languageLinks, profileSlug}: CVPdfPreviewProps) {
  const preview = useCvPdfPreview({locale, data, template, profileSlug});

  return (
    <div className="cv-root is-preview-mode min-h-screen py-0 sm:py-8 print:py-0">
      <CVToolbar
        locale={locale}
        languageLinks={languageLinks}
        filenameBase={preview.filenameBase}
        printPath={preview.appliedPrintPath}
      />

      <div className="mx-auto grid w-[min(100%,1600px)] gap-6 px-3 lg:grid-cols-[340px_minmax(0,1fr)] lg:px-6">
        <CVTemplateEditor
          locale={locale}
          data={data}
          draftTemplate={preview.draftTemplate}
          appliedTemplate={preview.appliedTemplate}
          persistedTemplate={preview.persistedTemplate}
          isSaving={preview.isSaving}
          saveFeedback={preview.saveFeedback}
          onTemplateChange={preview.handleTemplateChange}
          onValidate={preview.handleValidate}
          onSave={preview.handleSave}
          onReset={preview.handleReset}
        />

        <CVPdfPreviewFrame src={preview.previewUrl} title={`${data.header.name} PDF preview`} />
      </div>
    </div>
  );
}
