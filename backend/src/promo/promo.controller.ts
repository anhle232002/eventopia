import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { PromoService } from './services/promo.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/constants';
import { Roles } from 'src/common/decorators/role.decorator';
import { RequestUser } from 'src/users/users.dto';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { GetPromotionCodesDto } from './dto/get-promotion-codes.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdatePromoDto } from './dto/update-promo.dto';

@ApiTags('Promotion Codes')
@Controller('/api/promo')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @ApiBearerAuth()
  @Post()
  @Roles(Role.Organizer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async create(@Body() createPromoDto: CreatePromoDto, @ReqUser() user: RequestUser) {
    await this.promoService.create(createPromoDto, user);

    return {
      message: 'Create promotion code successfully',
    };
  }

  @ApiBearerAuth()
  @Get()
  @Roles(Role.Organizer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getPromotionCodes(@Query() getPromotionCodesDto: GetPromotionCodesDto, @ReqUser() user: RequestUser) {
    const { promotionCodes, total } = await this.promoService.getPromoCodes(getPromotionCodesDto, user);

    return { results: promotionCodes, page: getPromotionCodesDto.page, total };
  }

  @ApiBearerAuth()
  @Get(':id')
  @Roles(Role.Organizer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getPromotionCode(@Param('id', ParseIntPipe) id: number, @ReqUser() user: RequestUser) {
    const promotionCode = await this.promoService.getPromoDetail(id, user);

    return promotionCode;
  }

  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.Organizer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updatePromotionCode(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePromoDto: UpdatePromoDto,
    @ReqUser() user: RequestUser,
  ) {
    await this.promoService.updatePromoCode(id, updatePromoDto, user);

    return {
      message: 'Update promotion code successfully',
    };
  }

  // soft delete
  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.Organizer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async deletePromoCode() {
    return 'Currently not supported';
  }
}
