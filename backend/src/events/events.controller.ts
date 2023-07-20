import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from 'src/common/constants/role.enum';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { RedisCacheManager } from 'src/common/providers/redis/redis.service';
import { RequestUser } from 'src/users/users.dto';
import { CreateEventDto, GetEventsQuery, UpdateEventDto } from './events.dto';
import { EventsService } from './events.service';
import { imageFileValidations } from './events.validation';
import { Prisma } from '@prisma/client';

const HOUR = 60 * 60 * 1000;

@ApiTags('events')
@Controller('/api/events')
export class EventsController {
  constructor(private readonly eventService: EventsService, private readonly redisCache: RedisCacheManager) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(6 * HOUR)
  async getEvents(@Req() req: Request, @Query() query: GetEventsQuery) {
    const { events, total } = await this.eventService.getEvents(query);

    return { results: events, page: query.page, count: events.length, total: total };
  }

  @Get(':id')
  async getEvent(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventService.getEvent(id);

    return { result: event };
  }

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create event' })
  @Post()
  @Roles(Role.Organizer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FilesInterceptor('imageFiles', 10))
  async create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFiles(new ParseFilePipe({ validators: imageFileValidations }))
    imageFiles: Express.Multer.File[],
    @ReqUser()
    user: RequestUser,
  ) {
    createEventDto.organizerId = user.organizer.id;

    const event = await this.eventService.createEvent(createEventDto, imageFiles);

    await this.redisCache.deleteKeysPrefix('/api/events');

    return event;
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Update event' })
  @Put('/:id')
  @Roles(Role.Organizer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  async update(
    @Body() updateEventDto: UpdateEventDto,
    @Param('id', ParseIntPipe) id: number,
    @ReqUser() user: RequestUser,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    await this.eventService.updateEvent(id, updateEventDto, user, images);

    // clear cache
    await this.redisCache.deleteKeysPrefix('/api/events');

    return { message: 'Update event successfully' };
  }

  // TODO: test
  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.Organizer)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async Delete(@Param('id', ParseIntPipe) id: number, @ReqUser() user: RequestUser) {
    this.eventService.deleteEvent(id, user);

    return { message: 'Delete event successfully' };
  }

  @ApiOperation({ description: 'Looking forward to event' })
  @Put('/look/:id')
  @UseGuards(AuthGuard('jwt'))
  async lookEvent(@Param('id', ParseIntPipe) id: number, @ReqUser() user: RequestUser) {
    await this.eventService.lookForwardToEvent(id, user);

    return { message: 'Looked forward to event' };
  }

  @ApiOperation({ description: 'Unlook forward to event' })
  @Put('/unlook/:id')
  @UseGuards(AuthGuard('jwt'))
  async unlookEvent(@Param('id', ParseIntPipe) id: number, @ReqUser() user: RequestUser) {
    await this.eventService.unlookEvent(id, user);

    return { message: 'Unlooked forward to event' };
  }
}
