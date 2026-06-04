import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import puppeteer, {type Browser, type Page} from 'puppeteer';
import {
  CV_PDF_FILENAME_PREFIX,
  DEFAULT_LOCALE,
  isSupportedLocale,
  type Locale,
} from '@cv/common';

const PDF_TIMEOUT_MS = 60_000;
const DEFAULT_WEB_BASE_URL = 'http://localhost:3000';

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
  filenameBase: string;
  printPath: string;
};

function asRecord(value: unknown): JsonRecord | null {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return value as JsonRecord;
  }
  return null;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function resolveLocale(rawLocale: string | undefined): Locale {
  if (rawLocale && isSupportedLocale(rawLocale)) {
    return rawLocale;
  }
  return DEFAULT_LOCALE;
}

function resolveFilenameBase(data: JsonRecord): string {
  const filenameBase = asString(data.filenameBase);
  return filenameBase || CV_PDF_FILENAME_PREFIX;
}

function resolveWebBaseUrl() {
  const baseUrl = process.env.WEB_BASE_URL ?? DEFAULT_WEB_BASE_URL;
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

function resolvePrintUrl(printPath: string) {
  const normalizedPath = printPath.startsWith('/') ? printPath : `/${printPath}`;
  return `${resolveWebBaseUrl()}${normalizedPath}`;
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

  const printPath = asString(body.printPath);
  if (!printPath) {
    throw new BadRequestException('Body must include a "printPath" string');
  }

  return {
    locale: resolveLocale(rawLocale),
    filenameBase: resolveFilenameBase(body),
    printPath,
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
      const pdf = await this.generatePdf(requestPayload.printPath);
      return {
        locale: requestPayload.locale,
        filenameBase: requestPayload.filenameBase,
        pdf,
      };
    } catch (error) {
      const stack = error instanceof Error ? error.stack : String(error);
      this.logger.error('PDF export failed', stack);
      throw new InternalServerErrorException('Unable to generate PDF');
    }
  }

  private async generatePdf(printPath: string): Promise<Buffer> {
    let browser: Browser | null = null;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setViewport({width: 1240, height: 1754, deviceScaleFactor: 2});
      const response = await page.goto(resolvePrintUrl(printPath), {
        waitUntil: 'networkidle0',
        timeout: PDF_TIMEOUT_MS,
      });

      if (!response || !response.ok()) {
        throw new InternalServerErrorException(`Unable to render print page: ${printPath}`);
      }

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
