import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type {Response} from 'express';
import {AppService} from './app.service';
import {PdfService} from './pdf.service';

@Controller()
export class AppController {
  constructor(
    @Inject(AppService) private readonly appService: AppService,
    @Inject(PdfService) private readonly pdfService: PdfService,
  ) {}

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get('preview-pdf')
  async previewPdf(
    @Query() query: unknown,
    @Res() response: Response,
  ) {
    const {locale, filenameBase, pdf} = await this.pdfService.exportFromPayload(query);

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader(
      'Content-Disposition',
      `inline; filename="${filenameBase}-${locale}.pdf"`,
    );
    response.setHeader('Cache-Control', 'no-store');
    response.send(pdf);
  }

  @Post('export-pdf')
  @HttpCode(HttpStatus.OK)
  async exportPdf(
    @Body() body: unknown,
    @Res() response: Response,
  ) {
    const {locale, filenameBase, pdf} = await this.pdfService.exportFromPayload(body);

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${filenameBase}-${locale}.pdf"`,
    );
    response.setHeader('Cache-Control', 'no-store');
    response.send(pdf);
  }
}
