import {CV_PDF_FILENAME_PREFIX} from '@cv/common';
import {buildPrintHref, type CVData, type Locale} from '../cv-data';
import type {LocaleLink} from '../cv-types';
import {CVToolbar} from './CVToolbar';

type CVPdfPreviewProps = {
  locale: Locale;
  data: CVData;
  languageLinks: LocaleLink[];
  profileSlug: string;
};

const DEFAULT_API_BASE_URL = 'http://localhost:4000';

function resolveApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function CVPdfPreview({locale, data, languageLinks, profileSlug}: CVPdfPreviewProps) {
  const printPath = buildPrintHref(locale, profileSlug);
  const filenameBase = data.meta.filenameBase || CV_PDF_FILENAME_PREFIX;
  const previewUrl = `${resolveApiBaseUrl()}/api/v1/preview-pdf?${new URLSearchParams({
    locale,
    filenameBase,
    printPath,
  }).toString()}`;

  return (
    <div className="cv-root is-preview-mode min-h-screen py-0 sm:py-8 print:py-0">
      <CVToolbar
        locale={locale}
        languageLinks={languageLinks}
        filenameBase={filenameBase}
        printPath={printPath}
      />

      <div className="mx-auto w-[min(var(--a4-width),calc(100vw-1.5rem))] max-w-[var(--a4-width)]">
        <iframe
          title={`${data.header.name} PDF preview`}
          src={previewUrl}
          className="block h-[calc(100vh-2rem)] min-h-[900px] w-full rounded bg-white shadow-xl"
        />
      </div>
    </div>
  );
}
