import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { EmailNotification } from 'src/common/providers/notification/notification.service';
import { EventsService } from 'src/events/events.service';
import { TicketService } from 'src/ticket/ticket.service';

@Processor('payment')
export class PaymentProcessor {
  constructor(
    private readonly eventService: EventsService,
    private readonly ticketService: TicketService,
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  @Process('create-payment-email')
  async createPaymentEmail(job: Job) {
    try {
      const ticketIds = job.data.ticketIds;
      const order = job.data.order;

      const createQRTickets = ticketIds.map(async (id) => {
        const ticketVerifyUrl = await this.ticketService.getTicketVerifyUrl(id);

        return this.ticketService.createETicket('QR', { ticketVerifyUrl });
      });

      const QRTickets = await Promise.all(createQRTickets);

      // Get Event information
      const { title, location, startDate } = await this.eventService.getEvent(order.eventId);

      const attachedQrCodes = QRTickets.map((qrcode, index) => {
        return {
          filename: `qrcode-${ticketIds[index]}.png`,
          path: qrcode,
          cid: `qr-${index}`,
          position: index + 1,
        };
      });

      const notification: EmailNotification = {
        to: order.customerEmail,
        template: 'confirm-payment',
        context: {
          eventName: title,
          customerName: order.customerName,
          ticketType: order.type,
          quantity: order.quantity,
          total: order.quantity * order.price,
          qrCodes: attachedQrCodes,
          location,
          startDate,
        },
        attachments: attachedQrCodes,
        attachDataUrls: true,
      };

      await this.notificationQueue.add('send-email', { notification });
    } catch (error) {
      Logger.error(error);
    }
  }
}
