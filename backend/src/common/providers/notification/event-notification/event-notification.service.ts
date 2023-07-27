import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Event } from '@prisma/client';
import { Queue } from 'bull';
import { CronJob } from 'cron';
import { EmailNotification } from 'src/common/providers/notification/notification.service';
import { PrismaService } from 'src/common/providers/prisma.service';
import { UtilService } from 'src/common/providers/util.service';

@Injectable()
export class EventNotifcationService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly utilService: UtilService,
    private readonly prisma: PrismaService,
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  schedule(jobId: string, task: () => void, date: Date) {
    if (this.schedulerRegistry.doesExist('cron', jobId)) {
      this.schedulerRegistry.deleteCronJob(jobId);
    }

    const job = new CronJob(new Date(date), task);

    this.schedulerRegistry.addCronJob(jobId, job);

    job.start();
  }

  async sendEventReminderNotification(event: Partial<Event>) {
    const { tickets: receivers } = await this.prisma.event.findUnique({
      where: { id: event.id },
      select: {
        tickets: { select: { customerEmail: true, customerName: true }, distinct: ['customerEmail'] },
      },
    });

    const notifications = receivers.map(({ customerEmail, customerName }) => {
      const startDate = this.utilService.formatLocaleDate(event.startDate);
      const notification: EmailNotification = {
        to: customerEmail,
        template: 'notification',
        context: {
          username: customerName,
          eventName: event.title,
          eventDate: startDate,
          eventLocation: event.location,
        },
      };
      return {
        name: 'send-email',
        data: { notification },
      };
    });

    await this.notificationQueue.addBulk(notifications);
  }
}
