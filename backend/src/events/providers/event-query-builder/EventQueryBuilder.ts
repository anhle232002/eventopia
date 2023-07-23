import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventQueryBuilder {
  private query: Prisma.EventFindManyArgs;
  private PAGE_SIZE = 12;

  constructor() {
    this.query = {
      take: this.PAGE_SIZE,
      select: {
        id: true,
        title: true,
        shortDescription: true,
        images: true,
        organizer: {
          select: {
            id: true,
            picture: true,
            name: true,
            description: true,
          },
        },
        location: true,
        isCancelled: true,
        isOnlineEvent: true,
        venue: true,
        language: true,
        city: true,
        country: true,
        sold: true,
        startDate: true,
        duration: true,
        slug: true,
        ticketPrice: true,
        _count: { select: { looks: true } },
        categories: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {},
      orderBy: {
        startDate: Prisma.SortOrder.desc,
      },
    };
  }

  withPaginate(page = 1) {
    this.query.skip = this.PAGE_SIZE * (page - 1);

    return this;
  }

  withDateRange(range: { start: Date; end: Date }) {
    if (!range) return this;

    this.query.where.startDate = {
      gte: range.start,
      lte: range.end,
    };

    return this;
  }

  withOnlyOnlineEvent(isOnline: boolean) {
    if (!isOnline) return this;

    this.query.where.isOnlineEvent = true;
    return this;
  }

  withOrganizer(organizerId: string) {
    if (!organizerId) return this;

    this.query.where.organizerId = organizerId;
    return this;
  }

  withLocation({ city, country, timezone }: { city: string; country: string; timezone: string }) {
    if (!city || !country || !timezone) {
      return this;
    }

    if (!this.query.where.OR) {
      this.query.where.OR = [];
    }

    (<Array<Prisma.EventWhereInput>>this.query.where.OR).push({ city, country }, { timezone });
    return this;
  }

  withSearchTerm(s: string) {
    if (!s) return this;

    this.query.where.title = { contains: s };
    return this;
  }

  withCategory(categories: number[]) {
    if (!categories) return this;

    this.query.where.categories = { every: { id: { in: categories } } };

    return this;
  }

  build() {
    return this.query;
  }
}
