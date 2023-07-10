import { TicketGenerator } from './ticket.generator';
import QrCode from 'qrcode';

interface QRTicketParams {
  ticketVerifyUrl: string;
}

export class QRTicketGenerator implements TicketGenerator {
  async generate(params: QRTicketParams) {
    return QrCode.toDataURL(params.ticketVerifyUrl);
  }
}
