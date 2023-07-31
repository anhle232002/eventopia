import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Promo } from '@prisma/client';
import { isAfter, isBefore } from 'date-fns';
import { PrismaService } from 'src/common/providers/prisma.service';
import { RedisCacheManager } from 'src/common/providers/redis/redis.service';
import { RequestUser } from 'src/users/users.dto';
import { CreatePromoDto } from '../dto/create-promo.dto';

@Injectable()
export class PromoService {
  constructor(private readonly prisma: PrismaService, private readonly redis: RedisCacheManager) {}

  async create(createPromoDto: CreatePromoDto, user: RequestUser) {
    const args: Prisma.PromoCreateArgs = {
      data: {
        code: createPromoDto.code,
        discount: createPromoDto.discount,
        total: createPromoDto.total,
        type: createPromoDto.type,
        validFrom: createPromoDto.validFrom,
        validUntil: createPromoDto.validUntil,
        organizerId: user.organizer.id,
      },
    };

    // apply promo code to all event belong to organizer
    if (createPromoDto.applyAll) {
      args.data.promoOnOrganizer = {
        create: {
          organizerId: user.organizer.id,
        },
      };
    }

    const promo = await this.prisma.promo.create(args);

    // apply promo code on events
    if (createPromoDto.events) {
      const events = createPromoDto.events.map((id) => {
        return {
          eventId: id,
          promoId: promo.id,
        };
      });

      await this.prisma.promoOnEvent.createMany({
        data: events,
      });
    }

    return promo;
  }

  async getPromoCode(code: string) {
    const promoCode = await this.prisma.promo.findUnique({
      where: {
        code,
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

    if (!promoCode) {
      throw new NotFoundException('Promo code does not exist');
    }

    return promoCode;
  }

  isValidPromoCode(promoCode: Promo) {
    const now = new Date();

    return isAfter(now, new Date(promoCode.validFrom)) && isBefore(now, new Date(promoCode.validUntil));
  }

  isApplicableEvent(promoCode: Promo & { promoOnEvent: { eventId: number }[] }, eventId: number) {
    return !!promoCode.promoOnEvent.find((apply) => apply.eventId === eventId);
  }

  isApplicableOrganizer(
    promoCode: Promo & { promoOnOrganizer: { organizerId: string }[] },
    organizerId: string,
  ) {
    return !!promoCode.promoOnOrganizer.find((apply) => apply.organizerId === organizerId);
  }

  releasePromotionCode(promoCodeId: number, quantity: number) {
    if (!promoCodeId) return;

    return this.prisma.promo.update({
      where: {
        id: promoCodeId,
      },
      data: {
        used: { decrement: quantity },
      },
    });
  }
}
