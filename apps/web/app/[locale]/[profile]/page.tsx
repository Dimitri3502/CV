import {notFound} from 'next/navigation';
import {CVDocument} from '../components/CVDocument';
import {
  getAvailableLocaleLinks,
  getProfile,
  getProfileTitle,
  getStaticProfileParams,
  isLocale,
} from '../cv-data';
import {readTemplateById} from '../template-storage.server';

type PageProps = {
  params: Promise<{locale: string; profile: string}>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: {params: Promise<{locale: string; profile: string}>}) {
  const params = await props.params;
  const locale = params.locale;

  if (!isLocale(locale)) {
    return {title: 'CV'};
  }

  const profile = getProfile(locale, params.profile);
  if (!profile) {
    return {title: 'CV'};
  }

  return {
    title: `${getProfileTitle(profile.data)} — CV`,
  };
}

export default async function ProfileCVPage(props: PageProps) {
  const params = await props.params;
  const locale = params.locale;

  if (!isLocale(locale)) {
    notFound();
  }

  const profile = getProfile(locale, params.profile);
  if (!profile) {
    notFound();
  }

  const languageLinks = getAvailableLocaleLinks(profile.slug);
  const template = await readTemplateById(profile.data.meta.templateId);

  return (
    <CVDocument
      locale={locale}
      data={profile.data}
      template={template}
      languageLinks={languageLinks}
      profileSlug={profile.slug}
    />
  );
}

export function generateStaticParams() {
  return getStaticProfileParams();
}
