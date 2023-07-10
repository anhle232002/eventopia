import { TicketGenerator } from './ticket.generator';
import { readFile } from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';
import hbs from 'handlebars';
import { Logger } from '@nestjs/common';
import QRCode from 'qrcode';
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

      const buffer = await page.pdf({ path: 'test.pdf', format: 'a5', printBackground: true });

      await browser.close();

      return buffer;
    } catch (error) {
      Logger.error(error);
    }
  }
}
