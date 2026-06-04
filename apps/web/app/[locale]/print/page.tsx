import {notFound} from 'next/navigation';
import {getDefaultProfile, getProfileTitle, isLocale} from '../cv-data';
import {CVPrintDocument} from '../components/CVPrintDocument';

type PageProps = {
  params: Promise<{locale: string}>;
};

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
  const locale = params.locale;

  if (!isLocale(locale)) {
    notFound();
  }

  const profile = getDefaultProfile(locale);
  return <CVPrintDocument data={profile.data} />;
}
