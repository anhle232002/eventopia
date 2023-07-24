import { Controller, Get, Logger, Query } from '@nestjs/common';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { CommonService } from './providers/common.service';

@Controller('/api')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('/categories')
  async getCategories(@Query() getCategoriesDto: GetCategoriesDto) {
    const categories = await this.commonService.getCategories(getCategoriesDto);

    return categories;
  }

  @Get('/test')
  async test() {
    Logger.log('hello');
    throw new Error('Hello this got this error');
  }
}
