import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { startOfDay, endOfDay, endOfWeek, endOfMonth } from 'date-fns';
import { exec } from 'child_process';
import QrCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

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

  @Cron('*/20 * * * * *')
  async clearFolderFiles() {
    try {
      const folderPath = path.resolve('files');

      const a = await rimraf(`${process.cwd()}/**`, { glob: false });

      console.log(`${process.cwd()}/files/**`);

      Logger.log('Clear folder files succesfully', 'Util');
    } catch (error) {
      Logger.error(error, 'Util: Cannot clear folder files');
    }
  }
}
