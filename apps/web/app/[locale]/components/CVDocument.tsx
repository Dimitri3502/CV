import {isPolicyCvData, type CVData, type Locale} from '../cv-data';
import type {LocaleLink} from '../cv-types';
import {PolicyCvTemplate} from './PolicyCvTemplate';
import {CVTemplate} from './CVTemplate';

type CVDocumentProps = {
  locale: Locale;
  data: CVData;
  languageLinks: LocaleLink[];
  profileSlug: string;
};

export function CVDocument({locale, data, languageLinks, profileSlug}: CVDocumentProps) {
  if (isPolicyCvData(data)) {
    return (
      <PolicyCvTemplate
        locale={locale}
        data={data}
        languageLinks={languageLinks}
        profileSlug={profileSlug}
      />
    );
  }

  return (
    <CVTemplate
      locale={locale}
      messages={data}
      languageLinks={languageLinks}
      profileSlug={profileSlug}
    />
  );
}
