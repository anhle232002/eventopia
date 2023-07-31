import { Module } from '@nestjs/common';
import { PromoService } from './services/promo.service';
import { PromoController } from './promo.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [PromoController],
  providers: [PromoService],
  exports: [PromoService],
})
export class PromoModule {}
