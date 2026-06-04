import {notFound} from 'next/navigation';
import {
  getProfile,
  getProfileTitle,
  getStaticProfileParams,
  isLocale,
} from '../../cv-data';
import {CVPrintDocument} from '../../components/CVPrintDocument';

type PageProps = {
  params: Promise<{locale: string; profile: string}>;
};

export async function generateMetadata(props: {params: Promise<{locale: string; profile: string}>}) {
  const params = await props.params;
  const locale = params.locale;

  if (!isLocale(locale)) {
    return {title: 'CV Print'};
  }

  const profile = getProfile(locale, params.profile);
  if (!profile) {
    return {title: 'CV Print'};
  }

  return {
    title: `${getProfileTitle(profile.data)} — Print`,
  };
}

export default async function ProfilePrintCVPage(props: PageProps) {
  const params = await props.params;
  const locale = params.locale;

  if (!isLocale(locale)) {
    notFound();
  }

  const profile = getProfile(locale, params.profile);
  if (!profile) {
    notFound();
  }

  return <CVPrintDocument data={profile.data} />;
}

export function generateStaticParams() {
  return getStaticProfileParams();
}
