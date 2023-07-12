import { Logger } from '@nestjs/common';
import { TicketGenerator } from './ticket.generator';
import { readFile, mkdir } from 'fs/promises';
import fs from 'fs';
import puppeteer from 'puppeteer';
import hbs from 'handlebars';
import QRCode from 'qrcode';
import path from 'path';

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

export class PDFTicketGenerator implements TicketGenerator {
  private async compile(template: string, data: Record<string, any>) {
    try {
      const filePath = path.join(process.cwd(), 'src', 'templates', template);

      const html = await readFile(filePath);

      return hbs.compile(html.toString())(data);
    } catch (error) {
      Logger.error(error);
    }
  }

  async generate(data: { template: string; content: PDFTicketContent }) {
    try {
      const browser = await puppeteer.launch({ headless: 'new' });
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
    }
  }
}
