import { Stripe } from 'stripe';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma.service';
import { StripeService } from 'src/common/providers/stripe.service';
import { EventsService } from 'src/events/providers/event-service/events.service';
import { TicketService } from 'src/ticket/ticket.service';
import { PromoService } from 'src/promo/services/promo.service';
import { Promo } from '@prisma/client';
import { PROMOTION_TYPE } from 'src/common/constants';
import { CheckOutTicketDto, TOrder } from 'src/payment/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    private readonly eventService: EventsService,
    private readonly ticketService: TicketService,
    private readonly prisma: PrismaService,
    private readonly promotionService: PromoService,
    @InjectQueue('payment') private readonly paymentQueue: Queue,
  ) {}

  async checkoutTicket(checkOutTicketDto: CheckOutTicketDto) {
    const { available, message } = await this.eventService.isEventAvailable(checkOutTicketDto.eventId);

    if (!available) {
      throw new HttpException(message, 400);
    }

    // Create transaction
    const { event, promoCode } = await this.prisma.$transaction(async (tx) => {
      const event = await tx.event.update({
        where: { id: checkOutTicketDto.eventId },
        data: { sold: { increment: checkOutTicketDto.quantity } },
      });

      if (event.sold > event.totalTickets) {
        Logger.error('Tickets have been sold out', 'SOLD');
        throw new HttpException('Tickets have been sold out', 400);
      }

      // ticket with promo code
      let promoCode: Promo | null = null;

      if (checkOutTicketDto.promoCode) {
        try {
          const updatedPromo = await tx.promo.update({
            where: {
              code: checkOutTicketDto.promoCode,
            },
            data: {
              used: { increment: 1 },
            },
            include: {
              promoOnEvent: {
                select: { eventId: true },
              },
              promoOnOrganizer: {
                select: { organizerId: true },
              },
            },
          });
          if (!updatedPromo) {
            throw new NotFoundException('Promotion Code does not exist');
          }

          if (!this.promotionService.isValidPromoCode(updatedPromo)) {
            throw new BadRequestException('The promotion code is invalid');
          }

          if (updatedPromo.used > updatedPromo.total) {
            throw new BadRequestException('The promotion code has reached its maximum usage limit.');
          }

          if (
            !this.promotionService.isApplicableEvent(updatedPromo, event.id) &&
            !this.promotionService.isApplicableOrganizer(updatedPromo, event.organizerId)
          ) {
            throw new BadRequestException('Cannot apply this promotion code on this event');
          }

          if (!this.promotionService.isActivePromoCode(updatedPromo)) {
            throw new BadRequestException('The promotion code is currently not active');
          }
          promoCode = updatedPromo;
        } catch (error) {
          if (error.code === 'P2025') throw new BadRequestException('Promotion does not exist');

          throw error;
        }
      }

      return { event, promoCode };
    });

    let price = event.ticketPrice * 100;

    if (promoCode && promoCode.type === PROMOTION_TYPE.fix) {
      price = price - promoCode.discount;
    }
    if (promoCode && promoCode.type === PROMOTION_TYPE.percentage) {
      price = price - (price * promoCode.discount) / 100;
    }

    return this.stripeService.createSession({
      customerEmail: checkOutTicketDto.customerEmail,
      items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: event.title,
            },
            unit_amount: price,
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
        price: event.ticketPrice,
        promoId: promoCode?.id || null,
        type: 'standard',
      },
      currency: 'usd',
      mode: 'payment',
      cancelUrl:
        process.env.NODE_ENV === 'production'
          ? `${this.configService.get('HOST_NAME')}/api/payment/cancel?session_id={CHECKOUT_SESSION_ID}`
          : `http://localhost:3000/api/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
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

      const ticketOrder: TOrder = {
        eventId: Number(metadata.eventId),
        price: Number(metadata.price),
        quantity: Number(metadata.quantity),
        promoId: Number(metadata.promoId) || null,
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

  async fulfillTicketOrder(order: TOrder) {
    const ticketData = Array(order.quantity).fill({
      type: order.type,
      eventId: order.eventId,
      userId: order?.userId || undefined,
      price: order.price,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      customerCID: order.customerCID,
      promoId: order.promoId,
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

    await Promise.all([
      this.eventService.releaseReservedTickets(Number(metadata.eventId), Number(metadata.quantity)),
      this.promotionService.releasePromotionCode(Number(metadata.promoId), Number(metadata.quantity)),
    ]);
  }

  async handleOnCheckOutSessionCanceled(sessionId: string) {
    const { metadata } = await this.stripeService.retrieveSessionWithItems(sessionId);

    return await Promise.all([
      this.eventService.releaseReservedTickets(Number(metadata.eventId), Number(metadata.quantity)),
      this.promotionService.releasePromotionCode(Number(metadata.promoId), Number(metadata.quantity)),
    ]);
  }

  async getPaymentSession(sessionId: string) {
    const session = await this.stripeService.retrieveSessionWithItems(sessionId);

    return session;
  }
}
