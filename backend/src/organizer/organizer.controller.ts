import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Put,
  Query,
} from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/constants';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { RequestUser } from 'src/users/users.dto';
import { GetFollowersDto } from './dto/get-followers.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OptionalJWT } from 'src/common/guards/optional-jwt.guard';
import { UsersService } from 'src/users/users.service';

@ApiTags('organizers')
@Controller('/api/organizers')
export class OrganizerController {
  constructor(
    private readonly organizerService: OrganizerService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FileInterceptor('picture'))
  @Roles(Role.Individual)
  async create(
    @Body() createOrganizerDto: CreateOrganizerDto,
    @ReqUser() user: RequestUser,
    @UploadedFile() picture?: Express.Multer.File,
  ) {
    createOrganizerDto.userId = user.id;

    const organizer = await this.organizerService.create(createOrganizerDto, picture);

    return organizer;
  }

  @Get()
  findAll() {
    return this.organizerService.findAll();
  }

  @Get(':id')
  @UseGuards(OptionalJWT)
  async findOne(@Param('id') id: string, @ReqUser() user?: RequestUser) {
    const organizer = await this.organizerService.findOne(id);

    let isFollowedByYou = null;

    if (user) {
      isFollowedByYou = await this.usersService.isFollowingOrganizer(user.id, organizer.id);
    }

    return { ...organizer, isFollowedByYou };
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FileInterceptor('picture'))
  @Roles(Role.Organizer)
  update(
    @Param('id') id: string,
    @Body() updateOrganizerDto: UpdateOrganizerDto,
    @ReqUser() user: RequestUser,
    @UploadedFile() picture?: Express.Multer.File,
  ) {
    return this.organizerService.update(id, updateOrganizerDto, user, picture);
  }

  @ApiBearerAuth()
  @Put('/:organizerId/follow')
  @UseGuards(AuthGuard('jwt'))
  async followOrganizer(@Param('organizerId') organizerId: string, @ReqUser() user: RequestUser) {
    await this.organizerService.followOrganizer(organizerId, user);

    return { message: 'Follow organizer successfully' };
  }

  @ApiBearerAuth()
  @Put('/:organizerId/unfollow')
  @UseGuards(AuthGuard('jwt'))
  async unfollowOrganizer(@Param('organizerId') organizerId: string, @ReqUser() user: RequestUser) {
    await this.organizerService.unfollowOrganizer(organizerId, user);

    return { message: 'Unfollow organizer successfully' };
  }

  @Get('/:organizerId/followers')
  async getFollowers(@Param('organizerId') organizerId: string, @Query() query: GetFollowersDto) {
    const followers = await this.organizerService.getFollowers(organizerId, query.page, query.size);

    return { results: followers, page_size: query.size || 10, page: query.page || 1 };
  }
}
