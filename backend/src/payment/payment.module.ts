import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { EventsModule } from 'src/events/events.module';
import { BullModule } from '@nestjs/bull';
import { PaymentProcessor } from './payment.processor';
import { CommonModule } from 'src/common/common.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PromoModule } from 'src/promo/promo.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, PaymentProcessor],
  imports: [
    TicketModule,
    EventsModule,
    CommonModule,
    PromoModule,
    AuthModule,
    UsersModule,
    BullModule.registerQueue({ name: 'payment' }, { name: 'notification' }),
  ],
})
export class PaymentModule {}
