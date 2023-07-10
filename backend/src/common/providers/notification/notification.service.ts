import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

export interface NotificationService {
  sendEmail: (notification: EmailNotification) => Promise<any>;
}

export type EmailNotification = ISendMailOptions;

@Injectable()
export class NotificationServiceImpl implements NotificationService {
  constructor(private readonly mailerService: MailerService) {}

  sendEmail(notification: EmailNotification) {
    return this.mailerService.sendMail(notification);
  }
}
