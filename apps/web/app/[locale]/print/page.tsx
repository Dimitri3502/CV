import {notFound} from 'next/navigation';
import {getDefaultProfile, getProfileTitle, isLocale} from '../cv-data';
import {parseTemplateOverride} from '../template-utils';
import {CVPrintDocument} from '../components/CVPrintDocument';
import {readTemplateById} from '../template-storage.server';

type PageProps = {
  params: Promise<{locale: string}>;
  searchParams: Promise<{template?: string}>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: {params: Promise<{locale: string}>}) {
  const params = await props.params;
  const locale = params.locale;

  if (!isLocale(locale)) {
    return {title: 'CV Print'};
  }

  const profile = getDefaultProfile(locale);
  return {
    title: `${getProfileTitle(profile.data)} — Print`,
  };
}

export default async function PrintCVPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = params.locale;

  if (!isLocale(locale)) {
    notFound();
  }

  const profile = getDefaultProfile(locale);
  const persistedTemplate = await readTemplateById(profile.data.meta.templateId);
  const template = parseTemplateOverride(searchParams.template, persistedTemplate);
  return <CVPrintDocument data={profile.data} template={template} />;
}
