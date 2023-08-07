import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Event } from '@prisma/client';
import { Job, Queue } from 'bull';
import { EmailNotification } from 'src/common/providers/notification/notification.service';
import { UtilService } from 'src/common/providers/util.service';
import { EventsService } from 'src/events/providers/event-service/events.service';
import { PDFTicketContent } from 'src/ticket/generator/PDFTicket.generator';
import { TicketService } from 'src/ticket/ticket.service';
import { TOrder } from './payment.dto';

@Processor('payment')
export class PaymentProcessor {
  constructor(
    private readonly eventService: EventsService,
    private readonly ticketService: TicketService,
    private readonly utilService: UtilService,
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  @Process('create-payment-email')
  async createPaymentEmail(job: Job) {
    try {
      const ticketIds = job.data.ticketIds;
      const order = job.data.order as TOrder;
      const event = await this.eventService.getEvent(order.eventId);

      const pdfFiles = await this.createPDFTickets({ ticketIds, event, order });
      const QRTickets = await this.createQRTickets(ticketIds);

      const attachedQrCodes = QRTickets.map((qrcode, index) => {
        return {
          filename: `qrcode-${ticketIds[index]}.png`,
          path: qrcode,
          cid: `qr-${index}`,
          position: index + 1,
        };
      });

      const attachedPdfs = pdfFiles.map((file, index) => {
        return {
          filename: `ticket-${ticketIds[index]}.pdf`,
          path: file,
          cid: `ticket-${index}`,
        };
      });

      const notification: EmailNotification = {
        to: order.customerEmail,
        template: 'confirm-payment',
        context: {
          eventName: event.title,
          customerName: order.customerName,
          ticketType: order.type,
          quantity: order.quantity,
          total: order.quantity * order.price,
          qrCodes: attachedQrCodes,
          location: event.location,
          startDate: this.utilService.formatLocaleDate(event.startDate),
        },
        attachments: [...attachedQrCodes, ...attachedPdfs],
        attachDataUrls: true,
      };

      await this.notificationQueue.add('send-email', { notification });
    } catch (error) {
      Logger.error(error);
    }
  }

  async createPDFTickets({
    ticketIds,
    event,
    order,
  }: {
    ticketIds: string[];
    event: Partial<Event>;
    order: TOrder;
  }) {
    const createPDFTicketsPromises = ticketIds.map(async (id) => {
      const data: PDFTicketContent = {
        eventCity: event.city,
        eventCountry: event.country,
        eventDate: this.utilService.formatLocaleDate(event.startDate),
        eventDuration: event.duration,
        eventLocation: event.location,
        eventName: event.title,
        attendeeName: order.customerName,
        ticketId: id,
        ticketType: order.type,
        ticketVerifyUrl: await this.ticketService.getTicketVerifyUrl(id),
      };
      return this.ticketService.createETicket('PDF', { content: data, template: 'pdf-ticket.hbs' });
    });

    const pdfFiles = await Promise.all(createPDFTicketsPromises);

    return pdfFiles;
  }

  async createQRTickets(ticketIds: string[]) {
    const createQRTicketsPromises = ticketIds.map(async (id) => {
      const ticketVerifyUrl = await this.ticketService.getTicketVerifyUrl(id);

      return this.ticketService.createETicket('QR', { ticketVerifyUrl });
    });

    const qrTickets = await Promise.all(createQRTicketsPromises);

    return qrTickets;
  }
}
