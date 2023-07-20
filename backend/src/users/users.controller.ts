import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { RequestUser } from './users.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ description: 'Get liked events' })
  @ApiBearerAuth()
  @Get('/events/liked')
  @UseGuards(AuthGuard('jwt'))
  async getLikedEvents(@ReqUser() user: RequestUser) {
    const likedEvents = await this.usersService.getLikedEvents(user);

    const likedEventsIds = likedEvents.looks.map((e) => e.eventId);

    return likedEventsIds;
  }
}
