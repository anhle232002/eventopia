import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PromoService } from './services/promo.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/constants';
import { Roles } from 'src/common/decorators/role.decorator';
import { RequestUser } from 'src/users/users.dto';
import { ReqUser } from 'src/common/decorators/req-user.decorator';

@Controller('/api/promo')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Post()
  @Roles(Role.Organizer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() createPromoDto: CreatePromoDto, @ReqUser() user: RequestUser) {
    return this.promoService.create(createPromoDto, user);
  }
}
