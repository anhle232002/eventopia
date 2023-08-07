import { InjectQueue } from '@nestjs/bull';
import { ForbiddenException, HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Queue } from 'bull';
import { TICKET_STATUS } from 'src/common/constants';
import { PrismaService } from 'src/common/providers/prisma.service';
import { UtilService } from 'src/common/providers/util.service';
import { RequestUser } from 'src/users/users.dto';
import { TicketFactory, TICKET_TYPE } from './generator/ticket.factory';
import { CreateTicketDto, FindTicketDto, GetTicketByOrganizerDto, SendETicketDto } from './ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ticketFactory: TicketFactory,
    private readonly utilService: UtilService,
    private readonly configService: ConfigService,
    @InjectQueue('tickets') private readonly ticketsQueue: Queue,
  ) {}

  async getTicket(id: string, user: RequestUser) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, role: true } },
        event: {
          select: {
            id: true,
            title: true,
            organizerId: true,
            startDate: true,
            city: true,
            country: true,
            location: true,
            isCancelled: true,
            duration: true,
            images: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new HttpException('Ticket does not exist', 404);
    }

    // if user are not the owner and are not the admin also
    if (ticket.userId !== user.id && ticket.event.organizerId !== user.organizer.id) {
      throw new HttpException('FORBIDDEN', 403);
    }

    return ticket;
  }

  async getTicketsByUser(userId: string) {
    const tickets = await this.prisma.ticket.findMany({
      where: { userId: userId },
      include: { event: { select: { title: true, startDate: true, isCancelled: true } } },
    });

    return tickets;
  }

  async getTicketsByOrganizer(
    organizerId: string,
    getTicketByOrganizerDto: GetTicketByOrganizerDto,
    user: RequestUser,
  ) {
    const organizer = await this.prisma.organizer.findUnique({ where: { id: organizerId } });

    if (!organizer) {
      throw new NotFoundException('Organizer is not found');
    }

    if (organizerId !== user.organizer.id) {
      throw new ForbiddenException('User is the owner of the organizer');
    }

    const tickets = await this.prisma.ticket.findMany({
      where: {
        event: { organizerId, id: getTicketByOrganizerDto.eid },
        status: getTicketByOrganizerDto.status,
      },
      include: { event: { select: { title: true, startDate: true, isCancelled: true } } },
      orderBy: { updatedAt: 'desc' },
    });

    return tickets;
  }

  async getTicketsByEvent(eventId: number) {
    const tickets = await this.prisma.ticket.findMany({ where: { eventId } });

    return tickets;
  }

  async findTickets(findTicketDto: FindTicketDto) {
    const query: Prisma.TicketFindManyArgs = {
      where: { customerEmail: findTicketDto.email, customerCID: findTicketDto.cid },
      include: { event: true },
    };

    if (findTicketDto.eventId) {
      query.where.eventId = findTicketDto.eventId;
    }

    const tickets = await this.prisma.ticket.findMany(query);

    return tickets;
  }

  async processTicket(id: string, allow: boolean, user: RequestUser) {
    const ticket = await this.getTicket(id, user);

    if (ticket.status == TICKET_STATUS.ALLOWED) return;

    if (ticket.status == TICKET_STATUS.EXPIRED) {
      throw new HttpException('Ticket has been expired', 400);
    }

    const status = allow ? TICKET_STATUS.ALLOWED : TICKET_STATUS.REJECTED;

    await this.prisma.ticket.update({ where: { id }, data: { status } });

    return allow;
  }

  async createTicket(ticketData: CreateTicketDto) {
    const ticket = await this.prisma.ticket.create({
      data: ticketData,
      include: {
        event: {
          select: {
            title: true,
            country: true,
            city: true,
            duration: true,
            startDate: true,
            location: true,
          },
        },
      },
    });

    // off load save pdf to queue
    // await this.ticketsQueue.add('save-pdf-ticket', ticket);

    return ticket;
  }

  createETicket(type: TICKET_TYPE, params: any) {
    const ticket = this.ticketFactory.createTicket(type);

    return ticket.generate(params);
  }

  async getTicketVerifyUrl(ticketId: string) {
    if (process.env.NODE_ENV === 'production') {
      return `${this.configService.get<string>('DOMAIN')}/api/tickets/${ticketId}`;
    }
    const ipInLocal = await this.utilService.getHostIP();

    return `http://${ipInLocal}:3000/api/tickets/${ticketId}`;
  }

  async sendETickets({ email, cid, eventId }: SendETicketDto) {
    const tickets = await this.prisma.ticket.findMany({
      where: { customerEmail: email, customerCID: cid, eventId: eventId },
      include: {
        event: {
          select: { title: true, country: true, city: true, duration: true, startDate: true, location: true },
        },
      },
    });

    if (!tickets) {
      throw new NotFoundException('Did not found any ticket');
    }

    await this.ticketsQueue.add('send-tickets', tickets);

    return;
  }
}
