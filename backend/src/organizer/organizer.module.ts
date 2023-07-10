import { Module } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { OrganizerController } from './organizer.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [OrganizerController],
  providers: [OrganizerService],
  imports: [CommonModule],
  exports: [OrganizerService],
})
export class OrganizerModule {}
