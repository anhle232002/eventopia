import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { CommonModule } from 'src/common/common.module';
import { TicketFactory } from './generator/ticket.factory';
import { BullModule } from '@nestjs/bull';
import { TicketProcessor } from './ticket.processor';

@Module({
  imports: [CommonModule, BullModule.registerQueue({ name: 'tickets' }, { name: 'notification' })],
  controllers: [TicketController],
  providers: [TicketService, TicketFactory, TicketProcessor],
  exports: [TicketService],
})
export class TicketModule {}
