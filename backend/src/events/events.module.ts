import { Module } from '@nestjs/common';
import { EventsService } from './providers/event-service/events.service';
import { EventsController } from './events.controller';
import { BullModule } from '@nestjs/bull';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [BullModule.registerQueue({ name: 'notification' }), CommonModule, UsersModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
