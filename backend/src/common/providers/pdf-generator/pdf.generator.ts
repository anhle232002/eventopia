import { Logger } from '@nestjs/common';
import path from 'path';
import { readFile } from 'fs/promises';
import hbs from 'handlebars';

export abstract class PdfGenerator {
  /**
   * Compile hbs for pupeteer
   * @param template: template name
   * @param data
   * @returns
   */
  protected async compile(template: string, data: Record<string, any>) {
    try {
      const filePath = path.join(process.cwd(), 'src', 'templates', template);
      const html = await readFile(filePath);

      return hbs.compile(html.toString())(data);
    } catch (error) {
      Logger.error(error);

      throw error;
    }
  }

  abstract generate(data: any): string | Promise<string>;
}
