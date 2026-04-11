import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import puppeteer, {type Browser, type Page} from 'puppeteer';
import {DEFAULT_LOCALE, isSupportedLocale, type Locale} from '@cv/common';
import {buildCvHtml} from './pdf-template';

const PDF_TIMEOUT_MS = 60_000;

type JsonRecord = Record<string, unknown>;
type BrowserImage = {
  complete?: boolean;
  addEventListener?: (
    event: string,
    listener: () => void,
    options?: {once?: boolean},
  ) => void;
};

type PdfRequestPayload = {
  locale: Locale;
  data: JsonRecord;
};

function asRecord(value: unknown): JsonRecord | null {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return value as JsonRecord;
  }
  return null;
}

function resolveLocale(rawLocale: string | undefined): Locale {
  if (rawLocale && isSupportedLocale(rawLocale)) {
    return rawLocale;
  }
  return DEFAULT_LOCALE;
}

function validatePayload(payload: unknown): PdfRequestPayload {
  const body = asRecord(payload);
  if (!body) {
    throw new BadRequestException('Request body must be a JSON object');
  }

  const rawLocale = typeof body.locale === 'string' ? body.locale : undefined;
  if (rawLocale && !isSupportedLocale(rawLocale)) {
    throw new BadRequestException('Unsupported locale');
  }

  const data = asRecord(body.data);
  if (!data) {
    throw new BadRequestException('Body must include a "data" JSON object');
  }

  return {
    locale: resolveLocale(rawLocale),
    data,
  };
}

async function waitForPageAssets(page: Page) {
  await page.evaluate(async () => {
    const scopedGlobal = globalThis as {
      document?: {
        fonts?: {ready?: Promise<void>};
        images?: unknown[];
      };
    };

    const fontsReady = scopedGlobal.document?.fonts?.ready ?? Promise.resolve();
    const images = Array.from(scopedGlobal.document?.images ?? []).map(
      (image) => image as BrowserImage,
    );

    await Promise.all([
      fontsReady,
      ...images.map((image) => {
        const addEventListener = image.addEventListener;
        if (image.complete || !addEventListener) {
          return Promise.resolve();
        }
        return new Promise<void>((resolve) => {
          addEventListener.call(image, 'load', () => resolve(), {once: true});
          addEventListener.call(image, 'error', () => resolve(), {once: true});
        });
      }),
    ]);
  });
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async exportFromPayload(payload: unknown) {
    const requestPayload = validatePayload(payload);

    try {
      const pdf = await this.generatePdf(requestPayload.data);
      return {
        locale: requestPayload.locale,
        pdf,
      };
    } catch (error) {
      const stack = error instanceof Error ? error.stack : String(error);
      this.logger.error('PDF export failed', stack);
      throw new InternalServerErrorException('Unable to generate PDF');
    }
  }

  private async generatePdf(data: JsonRecord): Promise<Buffer> {
    let browser: Browser | null = null;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setViewport({width: 1240, height: 1754, deviceScaleFactor: 2});

      const html = buildCvHtml(data);
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: PDF_TIMEOUT_MS,
      });
      await page.emulateMediaType('print');
      await waitForPageAssets(page);

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
      });

      return Buffer.from(pdf);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
