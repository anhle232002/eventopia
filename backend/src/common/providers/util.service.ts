import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import QrCode from 'qrcode';
import { startOfDay, endOfDay, endOfWeek, endOfMonth } from 'date-fns';

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
}
