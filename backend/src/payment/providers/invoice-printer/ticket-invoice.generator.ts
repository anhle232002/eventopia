import { Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { PdfGenerator } from 'src/common/providers/pdf-generator/pdf.generator';
import { mkdir } from 'fs/promises';
import fs from 'fs';
import path from 'path';

interface TicketInvoice {
  eventName: string;
  eventDate: Date;
  ticketPrice: number;
  quantity: number;
  promotion?: {
    code: string;
    type: string;
    discount: number;
  };
  total: number;
}

export class TicketInvoiceGenerator extends PdfGenerator {
  async generate(data: TicketInvoice) {
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        executablePath: '/usr/bin/google-chrome',
        args: ['--no-sandbox', '--disable-gpu'],
      });
      const page = await browser.newPage();
      const content = await this.compile('invoices/ticket-invoice.hbs', data);

      await page.setContent(content);

      if (!fs.existsSync('files')) {
        await mkdir('files');
      }

      const fileName = path.resolve('files', `invoice-${Date.now()}.pdf`);

      await page.pdf({ path: fileName, format: 'a5', printBackground: true });
      await browser.close();

      return fileName;
    } catch (error) {
      Logger.error(error);

      throw error;
    }
  }
}
