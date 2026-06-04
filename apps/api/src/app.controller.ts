import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
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
