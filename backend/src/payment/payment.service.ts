import { Stripe } from 'stripe';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { StripeService } from 'src/common/providers/stripe.service';
import { EventsService } from 'src/events/providers/event-service/events.service';
import { CheckOutTicketDto, OrderArgs } from './payment.dto';
import { TicketService } from 'src/ticket/ticket.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    private readonly eventService: EventsService,
    private readonly ticketService: TicketService,
    private readonly prisma: PrismaService,
    @InjectQueue('payment') private readonly paymentQueue: Queue,
  ) {}

  async checkoutTicket(checkOutTicketDto: CheckOutTicketDto) {
    const { available, message } = await this.eventService.isEventAvailable(checkOutTicketDto.eventId);

    if (!available) {
      throw new HttpException(message, 400);
    }

    // Create transaction
    const updatedEvent = await this.prisma.$transaction(async (tx) => {
      const event = await tx.event.update({
        where: { id: checkOutTicketDto.eventId },
        data: { sold: { increment: checkOutTicketDto.quantity } },
      });

      if (event.sold > event.totalTickets) {
        Logger.error('Tickets have been sold out', 'SOLD');
        throw new HttpException('Tickets have been sold out', 400);
      }

      return event;
    });

    return this.stripeService.createSession({
      customerEmail: checkOutTicketDto.customerEmail,
      items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: updatedEvent.title,
            },
            unit_amount: updatedEvent.ticketPrice * 100,
          },
          quantity: checkOutTicketDto.quantity,
        },
      ],
      metadata: {
        eventId: checkOutTicketDto.eventId,
        quantity: checkOutTicketDto.quantity,
        customerEmail: checkOutTicketDto.customerEmail,
        customerName: checkOutTicketDto.customerName,
        customerCID: checkOutTicketDto.customerCID,
        userId: checkOutTicketDto.userId,
        price: updatedEvent.ticketPrice,
        type: 'standard',
      },
      currency: 'usd',
      mode: 'payment',
      cancelUrl:
        process.env.NODE_ENV === 'production'
          ? `${this.configService.get('HOST_NAME')}/api/payment/cancel/${checkOutTicketDto.eventId}?q=${
              checkOutTicketDto.quantity
            }`
          : `http://localhost:3000/api/payment/cancel/${checkOutTicketDto.eventId}?q=${checkOutTicketDto.quantity}`,
      sucessUrl: `${this.configService.get('CLIENT_URL')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    });
  }

  verifyWebhookEvent(payload, signature: string) {
    try {
      return this.stripeService.constructEvent(payload, signature);
    } catch (error) {
      Logger.error(error);

      throw new HttpException(`Webhook Error: ${error.message}`, 400);
    }
  }

  async handleOnCheckoutSessionCompleted(event: Stripe.Event) {
    try {
      const { metadata } = await this.stripeService.retrieveSessionWithItems((event.data.object as any).id);

      const ticketOrder: OrderArgs = {
        eventId: Number(metadata.eventId),
        price: Number(metadata.price),
        quantity: Number(metadata.quantity),
        customerEmail: metadata.customerEmail,
        customerName: metadata.customerName,
        customerCID: metadata.customerCID,
        type: metadata.type,
        userId: metadata.userId,
      };

      return this.fulfillTicketOrder(ticketOrder);
    } catch (error) {
      Logger.error(error);

      throw error;
    }
  }

  async fulfillTicketOrder(order: OrderArgs) {
    const ticketData = Array(order.quantity).fill({
      type: order.type,
      eventId: order.eventId,
      userId: order?.userId || undefined,
      price: order.price,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      customerCID: order.customerCID,
    });

    // considering using transaction
    const tickets = await Promise.all(
      ticketData.map((ticket) => {
        return this.ticketService.createTicket(ticket);
      }),
    );

    const ticketIds = tickets.map((ticket) => ticket.id);

    await this.paymentQueue.add('create-payment-email', { ticketIds, order });

    return tickets;
  }

  async handleOnCheckoutSessionExpired(event: Stripe.Event) {
    const { metadata } = await this.stripeService.retrieveSessionWithItems((event.data.object as any).id);

    return this.eventService.releaseReservedTickets(Number(metadata.eventId), Number(metadata.quantity));
  }

  async handleOnPaymentFailed(event: Stripe.Event) {
    const { metadata } = await this.stripeService.retrieveSessionWithItems((event.data.object as any).id);

    return this.eventService.releaseReservedTickets(Number(metadata.eventId), Number(metadata.quantity));
  }

  handleOnCheckOutSessionCanceled(eventId: number, quantity: number) {
    return this.eventService.releaseReservedTickets(eventId, quantity);
  }
  async getPaymentSession(sessionId: string) {
    const session = await this.stripeService.retrieveSessionWithItems(sessionId);

    return session;
  }
}
