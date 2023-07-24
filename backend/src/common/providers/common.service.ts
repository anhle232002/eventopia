import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetCategoriesDto } from '../dto/get-categories.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class CommonService {
  private PAGE_SIZE: number;
  constructor(private readonly prisma: PrismaService) {
    this.PAGE_SIZE = 20;
  }

  getCategories(getCategoriesDto: GetCategoriesDto) {
    const query: Prisma.CategoryFindManyArgs = {
      take: this.PAGE_SIZE,
      skip: (Number(getCategoriesDto.page || 1) - 1) * this.PAGE_SIZE,
      where: {},
    };

    if (getCategoriesDto.q) {
      query.where.name = { contains: getCategoriesDto.q };
    }

    if (getCategoriesDto.order && getCategoriesDto.order === 'trending') {
      query.orderBy = { events: { _count: 'desc' } };
    }

    return this.prisma.category.findMany(query);
  }
}
