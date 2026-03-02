import {notFound} from 'next/navigation';
import './globals.css';

const locales = ['en', 'fr'];

export async function generateMetadata(props: {params: Promise<{locale: string}>}) {
  const params = await props.params;
  const locale = params.locale;
  const messages = (await import(`../../messages/${locale}.json`)).default;
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
  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale)) {
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
