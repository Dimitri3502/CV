'use client';
import {useState} from 'react';
import {CV_PDF_FILENAME_PREFIX, type Locale} from '@cv/common';
import type {CVMessages} from '../i18n';

type ExportPdfButtonProps = {
  locale: Locale;
  data: CVMessages;
};

const DEFAULT_API_BASE_URL = 'http://localhost:4000';

function resolveApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function ExportPdfButton({locale, data}: ExportPdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const label = locale === 'fr' ? 'Exporter en PDF' : 'Export PDF';
  const loadingLabel = locale === 'fr' ? 'Generation...' : 'Generating...';

  async function handleClick() {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`${resolveApiBaseUrl()}/api/v1/export-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locale,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed (${response.status})`);
      }

      const pdfBlob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${CV_PDF_FILENAME_PREFIX}-${locale}.pdf`;
      document.body.append(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('PDF export failed', error);
      const message =
        locale === 'fr'
          ? 'Impossible de generer le PDF.'
          : 'Unable to generate the PDF.';
      window.alert(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="rounded bg-white/10 px-2 py-1 text-xs uppercase hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
}
