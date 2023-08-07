import { Logger } from '@nestjs/common';
import { mkdir } from 'fs/promises';
import fs from 'fs';
import puppeteer from 'puppeteer';
import QRCode from 'qrcode';
import path from 'path';
import { PdfGenerator } from 'src/common/providers/pdf-generator/pdf.generator';

export interface PDFTicketContent {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventCity: string;
  eventCountry: string;
  eventDuration: string;
  ticketId: string;
  ticketType: string;
  attendeeName: string;
  ticketVerifyUrl: string;
}

export class PDFTicketGenerator extends PdfGenerator {
  async generate(data: { template: string; content: PDFTicketContent }) {
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-gpu'],
      });
      const page = await browser.newPage();
      const qrcode = await QRCode.toDataURL(data.content.ticketVerifyUrl);
      const content = await this.compile(data.template, { ...data.content, qrcode });

      await page.setContent(content);

      if (!fs.existsSync('files')) {
        await mkdir('files');
      }

      const fileName = path.resolve('files', `${Date.now()}.pdf`);

      await page.pdf({ path: fileName, format: 'a5', printBackground: true });
      await browser.close();

      return fileName;
    } catch (error) {
      Logger.error(error);

      throw error;
    }
  }
}
