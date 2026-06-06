import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  CV_PDF_FILENAME_PREFIX,
  DEFAULT_LOCALE,
  isSupportedLocale,
  type Locale,
} from '@cv/common';

const PDF_TIMEOUT_MS = 60_000;
const DEFAULT_WEB_BASE_URL = 'http://localhost:3000';
const DEFAULT_PDF_RENDERER_BASE_URL = 'http://localhost:8001';

type JsonRecord = Record<string, unknown>;
type PdfRequestPayload = {
  locale: Locale;
  filenameBase: string;
  printPath: string;
};

class PdfRendererError extends Error {
  constructor(
    message: string,
    readonly details: string,
  ) {
    super(message);
    this.name = 'PdfRendererError';
  }
}

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

function resolvePdfRendererBaseUrl() {
  const baseUrl = process.env.PDF_RENDERER_BASE_URL ?? DEFAULT_PDF_RENDERER_BASE_URL;
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
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
      if (error instanceof PdfRendererError) {
        this.logger.error(error.message, error.details);
      }
      const stack = error instanceof Error ? error.stack : String(error);
      this.logger.error('PDF export failed', stack);
      throw new InternalServerErrorException('Unable to generate PDF');
    }
  }

  private async generatePdf(printPath: string): Promise<Buffer> {
    const printUrl = resolvePrintUrl(printPath);
    return this.generatePdfWithRenderer(printUrl);
  }

  private async generatePdfWithRenderer(printUrl: string): Promise<Buffer> {
    const response = await fetch(`${resolvePdfRendererBaseUrl()}/render-pdf`, {
      method: 'POST',
      headers: {
        'Accept': 'application/pdf',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url: printUrl}),
      signal: AbortSignal.timeout(PDF_TIMEOUT_MS),
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      throw new PdfRendererError(
        `Unable to reach PDF renderer at ${resolvePdfRendererBaseUrl()}`,
        message,
      );
    });

    if (!response.ok) {
      const details = await response.text();
      throw new PdfRendererError(
        `PDF renderer failed with status ${response.status}`,
        details,
      );
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/pdf')) {
      const details = await response.text();
      throw new PdfRendererError(
        'PDF renderer returned an unexpected content type',
        details,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
