import type {CVData, Locale} from '../cv-data';
import type {LocaleLink} from '../cv-types';
import {CVPdfPreview} from './CVPdfPreview';

type CVDocumentProps = {
  locale: Locale;
  data: CVData;
  languageLinks: LocaleLink[];
  profileSlug: string;
};

export function CVDocument({locale, data, languageLinks, profileSlug}: CVDocumentProps) {
  return (
    <CVPdfPreview
      locale={locale}
      data={data}
      languageLinks={languageLinks}
      profileSlug={profileSlug}
    />
  );
}
