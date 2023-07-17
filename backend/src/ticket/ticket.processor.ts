import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Event, Ticket } from '@prisma/client';
import { Job, Queue } from 'bull';
import path from 'path';
import { CloudinaryService } from 'src/common/providers/cloudinary/cloudinary.service';
import { EmailNotification } from 'src/common/providers/notification/notification.service';
import { PrismaService } from 'src/common/providers/prisma.service';
import { UtilService } from 'src/common/providers/util.service';
import { PDFTicketContent } from './generator/PDFTicket.generator';
import { TicketService } from './ticket.service';

@Processor('tickets')
export class TicketProcessor {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly ticketService: TicketService,
    private readonly utilService: UtilService,
    private readonly prisma: PrismaService,
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  @Process('save-pdf-ticket')
  async savePdfTicket(job: Job) {
    try {
      const ticket = job.data as Ticket & { event: Partial<Event> };
      const template = 'pdf-ticket.hbs';
      const ticketVerifyUrl = await this.ticketService.getTicketVerifyUrl(ticket.id);
      const content: PDFTicketContent = {
        eventName: ticket.event.title,
        eventCountry: ticket.event.country,
        eventDate: this.utilService.formatLocaleDate(ticket.event.startDate),
        eventCity: ticket.event.city,
        eventDuration: ticket.event.duration,
        eventLocation: ticket.event.location,
        ticketId: ticket.id,
        ticketType: ticket.type,
        attendeeName: ticket.customerName,
        ticketVerifyUrl,
      };

      const pdf = await this.ticketService.createETicket('PDF', { template, content });

      const { publicId } = await this.cloudinaryService.uploadFile(pdf, '/tickets');

      await this.prisma.ticket.update({ where: { id: ticket.id }, data: { pdfUrl: publicId } });
    } catch (error) {
      Logger.error(error);
    }
  }

  @Process('send-tickets')
  async sendETicket(job: Job) {
    try {
      const tickets = job.data as (Ticket & { event: Partial<Event> })[];

      // Download pdf from cloud (deprecated)
      // const files = await Promise.all(
      //   tickets.map((ticket) => {
      //     return this.cloudinaryService.downloadFile(ticket.pdfUrl, `${ticket.id}.pdf`);
      //   }),
      // );
      const files = await Promise.all(
        tickets.map(async (ticket) => {
          const pdfContent: PDFTicketContent = {
            attendeeName: ticket.customerName,
            eventCity: ticket.event.city,
            eventCountry: ticket.event.country,
            eventDate: this.utilService.formatLocaleDate(ticket.event.startDate),
            eventDuration: ticket.event.duration,
            eventLocation: ticket.event.location,
            eventName: ticket.event.title,
            ticketId: ticket.id,
            ticketType: ticket.type,
            ticketVerifyUrl: await this.ticketService.getTicketVerifyUrl(ticket.id),
          };
          return this.ticketService.createETicket('PDF', { template: 'pdf-ticket.hbs', content: pdfContent });
        }),
      );

      const attachments = files.map((file, index) => {
        return {
          filename: `ticket-${index}`,
          path: path.resolve('files', file),
          contentType: 'application/pdf',
        };
      });

      const email: EmailNotification = {
        to: tickets[0].customerEmail,
        template: 'send-e-ticket',
        context: {
          eventName: tickets[0].event.title,
          customerName: tickets[0].customerName,
          ticketType: tickets[0].type,
          quantity: tickets.length,
          location: tickets[0].event.location,
          startDate: this.utilService.formatLocaleDate(tickets[0].event.startDate),
        },
        attachments: attachments,
        attachDataUrls: false,
      };

      this.notificationQueue.add('send-email', { notification: email });
    } catch (error) {
      Logger.error(error);
    }
  }
}
