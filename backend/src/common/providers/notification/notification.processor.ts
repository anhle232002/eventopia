import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { NotificationService } from './notification.service';

@Processor('notification')
export class NotificationProcessor {
  constructor(@Inject('NotificationService') private readonly notificationService: NotificationService) {}

  @Process('send-email')
  async sendNotificationEmail(job: Job) {
    try {
      if (!job.data || !job.data.notification) {
        throw new Error('Email data is empty');
      }

      await this.notificationService.sendEmail(job.data.notification);
    } catch (error) {
      Logger.error(error);
    }
  }
}
