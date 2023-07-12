import { Module } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { OrganizerController } from './organizer.controller';
import { CommonModule } from 'src/common/common.module';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [OrganizerController],
  providers: [OrganizerService, UsersService],
  imports: [CommonModule],
  exports: [OrganizerService],
})
export class OrganizerModule {}
