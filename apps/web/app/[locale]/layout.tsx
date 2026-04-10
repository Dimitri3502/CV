import {notFound} from 'next/navigation';
import './globals.css';
import {getMessages, isLocale, locales} from './i18n';

export async function generateMetadata(props: {params: Promise<{locale: string}>}) {
  const params = await props.params;
  const locale = params.locale;

  if (!isLocale(locale)) {
    return {title: 'CV'};
  }

  const messages = getMessages(locale);
  const name = messages.Header.name;

  return {
    title: `${name} — CV`,
  };
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const params = await props.params;
  const locale = params.locale;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600&family=Bebas+Neue&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className="antialiased font-['Noto_Sans',_sans-serif] bg-[#DFDFDF] print:bg-[#DFDFDF]">
        {props.children}
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}
