import {notFound} from 'next/navigation';
import {CVTemplate} from './components/CVTemplate';
import {getMessages, isLocale} from './i18n';

type PageProps = {
  params: Promise<{locale: string}>;
  searchParams: Promise<{print?: string | string[]}>;
};

function isEnabled(flagParam: string | string[] | undefined) {
  const flag = Array.isArray(flagParam) ? flagParam[0] : flagParam;
  return flag === '1' || flag === 'true';
}

export default async function CVPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = params.locale;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const printMode = isEnabled(searchParams.print);

  return (
    <CVTemplate
      locale={locale}
      messages={messages}
      isPrintMode={printMode}
    />
  );
}
