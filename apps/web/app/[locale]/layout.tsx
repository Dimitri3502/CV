import {notFound} from 'next/navigation';
import './globals.css';
import {isLocale, locales} from './cv-data';

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
