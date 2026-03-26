import {NextRequest, NextResponse} from 'next/server';
import puppeteer, {type Browser, type Page} from 'puppeteer';

const PDF_TIMEOUT_MS = 60_000;
const DEFAULT_LOCALE = 'fr';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function resolveLocale(rawLocale: string | null) {
  if (rawLocale === 'en' || rawLocale === 'fr') {
    return rawLocale;
  }
  return DEFAULT_LOCALE;
}

function resolveBaseUrl(request: NextRequest) {
  const configuredBaseUrl =
    process.env.PDF_EXPORT_BASE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL;

  if (configuredBaseUrl) {
    if (configuredBaseUrl.startsWith('http://') || configuredBaseUrl.startsWith('https://')) {
      return configuredBaseUrl;
    }
    return `https://${configuredBaseUrl}`;
  }

  return request.nextUrl.origin;
}

async function waitForPageAssets(page: Page) {
  await page.evaluate(async () => {
    const fontPromise = document.fonts?.ready ?? Promise.resolve();
    const images = Array.from(document.images);

    await Promise.all([
      fontPromise,
      ...images.map((image) => {
        if (image.complete) {
          return Promise.resolve();
        }
        return new Promise<void>((resolve) => {
          image.addEventListener('load', () => resolve(), {once: true});
          image.addEventListener('error', () => resolve(), {once: true});
        });
      }),
    ]);
  });
}

export async function GET(request: NextRequest) {
  const locale = resolveLocale(request.nextUrl.searchParams.get('locale'));
  const baseUrl = resolveBaseUrl(request);
  const pageUrl = new URL(`/${locale}`, baseUrl);
  pageUrl.searchParams.set('print', '1');

  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({width: 1240, height: 1754, deviceScaleFactor: 2});
    await page.goto(pageUrl.toString(), {
      waitUntil: 'networkidle0',
      timeout: PDF_TIMEOUT_MS,
    });
    await page.emulateMediaType('print');
    await waitForPageAssets(page);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
    });

    const pdfBlob = new Blob([Uint8Array.from(pdf)], {type: 'application/pdf'});

    return new NextResponse(pdfBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="dimitri-beubry-cv-${locale}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('PDF export failed', error);
    return NextResponse.json(
      {error: 'Unable to generate PDF'},
      {status: 500},
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
