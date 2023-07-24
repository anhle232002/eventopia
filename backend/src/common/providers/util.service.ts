import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { startOfDay, endOfDay, endOfWeek, endOfMonth } from 'date-fns';
import { exec } from 'child_process';
import QrCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';

@Injectable()
export class UtilService {
  createQrCode(payload: string) {
    return QrCode.toDataURL(payload);
  }

  formatLocaleDate(date: Date | number | string) {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  getHostIP() {
    return new Promise((resolve, reject) => {
      exec('hostname -I', (err, stdout) => {
        if (err) reject(err);

        resolve(stdout.split(' ')[0]);
      });
    });
  }

  getStartOfDay() {
    return startOfDay(new Date());
  }

  getTodayRange() {
    const now = new Date();

    return { start: startOfDay(now), end: endOfDay(now) };
  }

  getThisWeekRange() {
    const now = new Date();

    return { start: startOfDay(now), end: endOfWeek(now) };
  }

  getThisMonthRange() {
    const now = new Date();

    return { start: startOfDay(now), end: endOfMonth(now) };
  }

  getDateRange(type: string) {
    switch (type) {
      case 'today': {
        const { start, end } = this.getTodayRange();
        return {
          start,
          end,
        };
      }

      case 'this_week': {
        const { start, end } = this.getThisWeekRange();
        return {
          start,
          end,
        };
      }

      case 'this_month': {
        const { start, end } = this.getThisMonthRange();
        return {
          start,
          end,
        };
      }

      default: {
        return null;
      }
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async clearFolderFiles() {
    try {
      const folderPath = path.resolve('files');

      await fs.rm(`${folderPath}`, { recursive: true, force: true });
      await fs.mkdir(folderPath);

      Logger.log('Clear folder files succesfully', 'Util');
    } catch (error) {
      Logger.error(error, 'Util: Cannot clear folder files');

      throw new Error(error.message);
    }
  }
}
