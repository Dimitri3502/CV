import type {CVData, CVTemplate, Locale} from '../cv-data';
import type {LocaleLink} from '../cv-types';
import {CVPdfPreview} from './CVPdfPreview';

type CVDocumentProps = {
  locale: Locale;
  data: CVData;
  template: CVTemplate;
  languageLinks: LocaleLink[];
  profileSlug: string;
};

export function CVDocument({locale, data, template, languageLinks, profileSlug}: CVDocumentProps) {
  return (
    <CVPdfPreview
      locale={locale}
      data={data}
      template={template}
      languageLinks={languageLinks}
      profileSlug={profileSlug}
    />
  );
}
