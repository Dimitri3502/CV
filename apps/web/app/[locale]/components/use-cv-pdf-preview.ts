'use client';

import {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import {CV_PDF_FILENAME_PREFIX} from '@cv/common';
import {buildPrintHref, type CVData, type CVTemplate, type Locale} from '../cv-data';
import {buildPrintPathWithTemplate, cloneTemplate} from '../template-utils';

const DEFAULT_API_BASE_URL = 'http://localhost:4000';

function resolveApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

type UseCvPdfPreviewArgs = {
  locale: Locale;
  data: CVData;
  template: CVTemplate;
  profileSlug: string;
};

export function useCvPdfPreview({locale, data, template, profileSlug}: UseCvPdfPreviewArgs) {
  const router = useRouter();
  const basePrintPath = buildPrintHref(locale, profileSlug);
  const filenameBase = data.meta.filenameBase || CV_PDF_FILENAME_PREFIX;
  const [draftTemplate, setDraftTemplate] = useState<CVTemplate>(() => cloneTemplate(template));
  const [appliedTemplate, setAppliedTemplate] = useState<CVTemplate>(() => cloneTemplate(template));
  const [persistedTemplate, setPersistedTemplate] = useState<CVTemplate>(() => cloneTemplate(template));
  const [previewNonce, setPreviewNonce] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{tone: 'success' | 'error'; message: string} | null>(null);

  useEffect(() => {
    const nextTemplate = cloneTemplate(template);
    setDraftTemplate(nextTemplate);
    setAppliedTemplate(nextTemplate);
    setPersistedTemplate(nextTemplate);
  }, [template]);

  const appliedPrintPath = useMemo(
    () => buildPrintPathWithTemplate(basePrintPath, appliedTemplate, template),
    [appliedTemplate, basePrintPath, template],
  );

  const previewUrl = useMemo(
    () =>
      `${resolveApiBaseUrl()}/api/v1/preview-pdf?${new URLSearchParams({
        locale,
        filenameBase,
        printPath: appliedPrintPath,
        nonce: String(previewNonce),
      }).toString()}`,
    [appliedPrintPath, filenameBase, locale, previewNonce],
  );

  function handleValidate() {
    setSaveFeedback(null);
    setAppliedTemplate(cloneTemplate(draftTemplate));
    setPreviewNonce((currentValue) => currentValue + 1);
  }

  function handleReset() {
    setSaveFeedback(null);
    setDraftTemplate(cloneTemplate(appliedTemplate));
  }

  function handleTemplateChange(nextTemplate: CVTemplate) {
    setSaveFeedback(null);
    setDraftTemplate(nextTemplate);
  }

  async function handleSave() {
    setIsSaving(true);
    setSaveFeedback(null);

    try {
      const response = await fetch(`/api/cv-templates/${encodeURIComponent(template.id)}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({template: draftTemplate}),
      });
      const payload = (await response.json()) as {template?: CVTemplate; error?: string};

      if (!response.ok || !payload.template) {
        throw new Error(payload.error ?? (locale === 'fr' ? 'Impossible de sauvegarder le template.' : 'Unable to save template.'));
      }

      const savedTemplate = cloneTemplate(payload.template);
      setPersistedTemplate(savedTemplate);
      setDraftTemplate(savedTemplate);
      setAppliedTemplate(savedTemplate);
      setPreviewNonce((currentValue) => currentValue + 1);
      setSaveFeedback({
        tone: 'success',
        message: locale === 'fr' ? 'Template enregistré dans le repo.' : 'Template saved to the repo.',
      });
      router.refresh();
    } catch (error) {
      setSaveFeedback({
        tone: 'error',
        message:
          error instanceof Error
            ? error.message
            : locale === 'fr'
              ? 'Impossible de sauvegarder le template.'
              : 'Unable to save template.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return {
    appliedPrintPath,
    draftTemplate,
    appliedTemplate,
    persistedTemplate,
    filenameBase,
    isSaving,
    previewUrl,
    saveFeedback,
    handleReset,
    handleSave,
    handleTemplateChange,
    handleValidate,
  };
}
