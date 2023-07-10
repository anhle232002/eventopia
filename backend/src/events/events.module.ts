import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { BullModule } from '@nestjs/bull';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [BullModule.registerQueue({ name: 'notification' }), CommonModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
