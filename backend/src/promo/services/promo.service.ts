import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Promo } from '@prisma/client';
import { isAfter, isBefore } from 'date-fns';
import { PROMOTION_STATUS } from 'src/common/constants';
import { PrismaService } from 'src/common/providers/prisma.service';
import { UtilService } from 'src/common/providers/util.service';
import { RequestUser } from 'src/users/users.dto';
import { CreatePromoDto } from '../dto/create-promo.dto';
import { GetPromotionCodesDto } from '../dto/get-promotion-codes.dto';
import { UpdatePromoDto } from '../dto/update-promo.dto';

@Injectable()
export class PromoService {
  constructor(private readonly prisma: PrismaService, private readonly utilService: UtilService) {}

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

  async getPromoCodes(getPromotionCodesDto: GetPromotionCodesDto, user: RequestUser) {
    const PAGE_SIZE = 15;
    const query: Prisma.PromoFindManyArgs = {
      take: PAGE_SIZE,
      skip: PAGE_SIZE * (getPromotionCodesDto.page - 1),
      where: {
        organizerId: user.organizer.id,
      },
    };

    const [promotionCodes, total] = await Promise.all([
      this.prisma.promo.findMany(query),
      this.prisma.promo.count({
        where: query.where,
      }),
    ]);

    return { promotionCodes, total };
  }

  async getPromoDetail(id: number, user: RequestUser) {
    const query: Prisma.PromoFindFirstArgs = {
      where: { id },
      include: {
        organizer: true,
        promoOnEvent: {
          select: {
            event: {
              select: {
                id: true,
                title: true,
                slug: true,
                location: true,
                city: true,
                timezone: true,
                ticketPrice: true,
                startDate: true,
                totalTickets: true,
                sold: true,
              },
            },
          },
        },
      },
    };

    const promotionCode = await this.prisma.promo.findFirst(query);

    if (!promotionCode) {
      throw new NotFoundException('Promotion code does not exist');
    }

    if (promotionCode.organizerId !== user.organizer.id) {
      throw new ForbiddenException('Promotion code does not belong to this organizer');
    }

    return promotionCode;
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

  async updatePromoCode(id: number, updatePromoDto: UpdatePromoDto, user: RequestUser) {
    const promoCode = await this.prisma.promo.findUnique({
      where: {
        id,
      },
    });

    if (!promoCode) {
      throw new NotFoundException('Promo code does not exist');
    }

    if (promoCode.organizerId !== user.organizer.id) {
      throw new ForbiddenException('Promotion code does not belong to this organizer');
    }

    if (updatePromoDto.validUntil && isBefore(updatePromoDto.validUntil, new Date(promoCode.validFrom))) {
      throw new BadRequestException(
        `Valid until Date must be after valid from ${this.utilService.formatLocaleDate(promoCode.validFrom)}`,
      );
    }

    if (updatePromoDto.total <= promoCode.used) {
      throw new BadRequestException('Total available promotion code usage must be larger than total used');
    }

    const updatedPromoCode = await this.prisma.promo.update({
      where: { id },
      data: {
        total: updatePromoDto.total,
        discount: updatePromoDto.discount,
        type: updatePromoDto.type,
        validFrom: updatePromoDto.validFrom,
        validUntil: updatePromoDto.validUntil,
        status: updatePromoDto.status,
      },
      include: {
        promoOnEvent: {
          select: {
            eventId: true,
          },
        },
      },
    });

    if (typeof updatePromoDto.applyAll !== 'undefined') {
      if (!!updatePromoDto.applyAll) {
        await this.prisma.promoOnOrganizer.upsert({
          create: {
            organizerId: user.organizer.id,
            promoId: id,
          },
          update: {
            organizerId: user.organizer.id,
            promoId: id,
          },
          where: {
            promoId_organizerId: {
              organizerId: user.organizer.id,
              promoId: id,
            },
          },
        });
      } else {
        try {
          await this.prisma.promoOnOrganizer.delete({
            where: {
              promoId_organizerId: { organizerId: user.organizer.id, promoId: id },
            },
          });
        } catch (error) {
          if (error.code === 'P2025') {
            Logger.log(`promoOnOrganizer does not exist: promoid:${id} , organizerId:${user.organizer.id} `);
          } else {
            throw error;
          }
        }
      }
    }

    // Include events
    if (updatePromoDto.events) {
      const applicableEventsIdsSet = new Set(updatedPromoCode.promoOnEvent.map((e) => e.eventId));
      const newApplycableEvents = updatePromoDto.events.filter((e) => {
        return !applicableEventsIdsSet.has(e);
      });

      await this.prisma.promoOnEvent.createMany({
        data: newApplycableEvents.map((event) => {
          return {
            promoId: id,
            eventId: event,
          };
        }),
      });
    }

    // Exclude events
    if (updatePromoDto.exclude) {
      const applicableEventsIdsSet = new Set(updatedPromoCode.promoOnEvent.map((e) => e.eventId));
      const excludedEventsIds = updatePromoDto.exclude.filter((e) => {
        return applicableEventsIdsSet.has(e);
      });

      await this.prisma.promoOnEvent.deleteMany({
        where: {
          promoId: id,
          eventId: {
            in: excludedEventsIds,
          },
        },
      });
    }
  }

  isActivePromoCode(promoCode: Promo) {
    return promoCode.status === PROMOTION_STATUS.ACTIVE;
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
