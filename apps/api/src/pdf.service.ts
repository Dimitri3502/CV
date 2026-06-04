import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {existsSync, mkdirSync} from 'node:fs';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {
  CV_PDF_FILENAME_PREFIX,
  DEFAULT_LOCALE,
  isSupportedLocale,
  type Locale,
} from '@cv/common';

const PDF_TIMEOUT_MS = 60_000;
const DEFAULT_WEB_BASE_URL = 'http://localhost:3000';
const DEFAULT_WEASYPRINT_PYTHON_BIN = 'python3';
const WEASYPRINT_PYTHON_SNIPPET = `
import sys
from weasyprint import HTML

if len(sys.argv) < 2:
    raise SystemExit("Missing print URL")

HTML(url=sys.argv[1]).write_pdf(target=sys.stdout.buffer)
`.trim();

type JsonRecord = Record<string, unknown>;
type PdfRequestPayload = {
  locale: Locale;
  filenameBase: string;
  printPath: string;
};

class WeasyPrintProcessError extends Error {
  constructor(
    message: string,
    readonly stderr: string,
  ) {
    super(message);
    this.name = 'WeasyPrintProcessError';
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

function resolveWeasyPrintPythonBin() {
  const configuredBinary = process.env.WEASYPRINT_PYTHON_BIN?.trim();
  if (configuredBinary) {
    return configuredBinary;
  }

  const bundledBinary = path.resolve(__dirname, '..', '.venv-weasyprint', 'bin', 'python');
  if (existsSync(bundledBinary)) {
    return bundledBinary;
  }

  return DEFAULT_WEASYPRINT_PYTHON_BIN;
}

function resolveWeasyPrintCacheDir() {
  const cacheDir = path.resolve(__dirname, '..', '.cache', 'weasyprint');
  mkdirSync(cacheDir, {recursive: true});
  return cacheDir;
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
      const stack = error instanceof Error ? error.stack : String(error);
      this.logger.error('PDF export failed', stack);
      throw new InternalServerErrorException('Unable to generate PDF');
    }
  }

  private async generatePdf(printPath: string): Promise<Buffer> {
    const printUrl = resolvePrintUrl(printPath);
    return this.generatePdfWithWeasyPrint(printUrl);
  }

  private async generatePdfWithWeasyPrint(printUrl: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const child = spawn(
        resolveWeasyPrintPythonBin(),
        ['-c', WEASYPRINT_PYTHON_SNIPPET, printUrl],
        {
          stdio: ['ignore', 'pipe', 'pipe'],
          env: {
            ...process.env,
            XDG_CACHE_HOME: resolveWeasyPrintCacheDir(),
          },
        },
      );
      const stdoutChunks: Buffer[] = [];
      const stderrChunks: Buffer[] = [];
      let didTimeOut = false;

      const timeout = setTimeout(() => {
        didTimeOut = true;
        child.kill('SIGKILL');
      }, PDF_TIMEOUT_MS);

      child.stdout.on('data', (chunk: Buffer | string) => {
        stdoutChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });

      child.stderr.on('data', (chunk: Buffer | string) => {
        stderrChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });

      child.on('error', (error) => {
        clearTimeout(timeout);
        reject(new WeasyPrintProcessError(
          `Unable to start WeasyPrint with "${resolveWeasyPrintPythonBin()}": ${error.message}`,
          '',
        ));
      });

      child.on('close', (code, signal) => {
        clearTimeout(timeout);
        const stderr = Buffer.concat(stderrChunks).toString('utf8').trim();

        if (code === 0) {
          resolve(Buffer.concat(stdoutChunks));
          return;
        }

        if (didTimeOut) {
          reject(new WeasyPrintProcessError(
            `WeasyPrint timed out after ${PDF_TIMEOUT_MS}ms`,
            stderr,
          ));
          return;
        }

        reject(new WeasyPrintProcessError(
          `WeasyPrint failed with code ${code ?? 'unknown'}${signal ? ` (${signal})` : ''}`,
          stderr,
        ));
      });
    });
  }
}
