import { Injectable } from '@nestjs/common';
import { PDFTicketGenerator } from './PDFTicket.generator';
import { QRTicketGenerator } from './QRTicket.generator';
import { TicketGenerator } from './ticket.generator';
export type TICKET_TYPE = 'QR' | 'PDF';

@Injectable()
export class TicketFactory {
  createTicket(type: TICKET_TYPE): TicketGenerator {
    switch (type) {
      case 'QR':
        return new QRTicketGenerator();
      case 'PDF':
        return new PDFTicketGenerator();
      default:
        throw new Error(`Invalid ticket type: ${type}`);
    }
  }
}
