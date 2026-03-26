import {notFound} from 'next/navigation';
import {CVTemplate} from './components/CVTemplate';
import {getMessages, isLocale} from './i18n';

type PageProps = {
  params: Promise<{locale: string}>;
  searchParams: Promise<{print?: string | string[]}>;
};

function isPrintMode(printParam: string | string[] | undefined) {
  const print = Array.isArray(printParam) ? printParam[0] : printParam;
  return print === '1' || print === 'true';
}

export default async function CVPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = params.locale;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = getMessages(locale);
  const printMode = isPrintMode(searchParams.print);

  return <CVTemplate locale={locale} messages={messages} isPrintMode={printMode} />;
}
