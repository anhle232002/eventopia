import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Organizer, Prisma } from '@prisma/client';
import { Role } from 'src/common/constants';
import { CloudinaryService } from 'src/common/providers/cloudinary/cloudinary.service';
import { PrismaService } from 'src/common/providers/prisma.service';
import { RequestUser } from 'src/users/users.dto';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { GetEventDto } from './dto/get-events.dto';
import { UpdateOrganizerDto } from './dto/update-organizer.dto';

@Injectable()
export class OrganizerService {
  constructor(private readonly cloudinary: CloudinaryService, private readonly prisma: PrismaService) {}
  private EVENTS_PAGE_SIZE = 15;
  private TICKETS_PAGE_SIZE = 15;

  async create(createOrganizerDto: CreateOrganizerDto, picture?: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: { id: createOrganizerDto.userId },
      select: { id: true, picture: true, organizer: { select: { id: true } } },
    });

    if (!user) throw new NotFoundException('User does not exist');

    if (user.organizer) throw new BadRequestException('User is already a organizer');

    if (picture) {
      const [pictureUrl] = await this.cloudinary.uploadImages([picture]);

      createOrganizerDto.picture = pictureUrl.url;
    } else {
      createOrganizerDto.picture = user.picture;
    }

    const [organizer] = await this.prisma.$transaction([
      this.prisma.organizer.create({ data: createOrganizerDto }),
      this.prisma.user.update({ where: { id: createOrganizerDto.userId }, data: { role: Role.Organizer } }),
    ]);

    return organizer;
  }

  findAll() {
    return this.prisma.organizer.findMany();
  }

  async findOne(id: string) {
    const organizer: Partial<Organizer> & { followers?: number; _count: { followers: number } } =
      await this.prisma.organizer.findUnique({
        where: { id },
        select: {
          _count: { select: { followers: true } },
          name: true,
          id: true,
          phoneNumber: true,
          social: true,
          picture: true,
          email: true,
          description: true,
        },
      });

    if (!organizer) {
      throw new NotFoundException('Organizer is not found');
    }

    organizer.followers = organizer._count.followers;

    delete organizer._count;

    return organizer;
  }

  async update(
    id: string,
    updateOrganizerDto: UpdateOrganizerDto,
    user: RequestUser,
    picture: Express.Multer.File,
  ) {
    const organizer = await this.prisma.organizer.findUnique({ where: { id } });

    if (organizer.userId !== user.id) throw new ForbiddenException();

    if (picture) {
      const [pictureUrl] = await this.cloudinary.uploadImages([picture]);

      updateOrganizerDto.picture = pictureUrl.url;
    }

    return this.prisma.organizer.update({ where: { id }, data: updateOrganizerDto });
  }

  remove(id: number) {
    return `This action removes a #${id} organizer`;
  }

  async followOrganizer(id: string, user: RequestUser) {
    if (user.organizer && id === user.organizer.id) {
      throw new BadRequestException('Cannot follow yourself');
    }

    const organizer = await this.prisma.organizer.findUnique({ where: { id } });

    if (!organizer) {
      throw new NotFoundException('Organizer does not exist');
    }

    return await this.prisma.organizer.update({
      where: { id },
      data: {
        followers: {
          connectOrCreate: {
            create: { userId: user.id },
            where: { userId_organizerId: { userId: user.id, organizerId: organizer.id } },
          },
        },
      },
    });
  }

  async unfollowOrganizer(id: string, user: RequestUser) {
    const organizer = await this.prisma.organizer.findUnique({ where: { id } });

    if (!organizer) {
      throw new NotFoundException('Organizer does not exist');
    }

    const isFollowed = await this.prisma.follower.findUnique({
      where: { userId_organizerId: { organizerId: organizer.id, userId: user.id } },
    });

    if (!isFollowed) {
      throw new BadRequestException('Organizer has not been followed by you');
    }

    return await this.prisma.organizer.update({
      where: { id },
      data: { followers: { delete: { userId_organizerId: { organizerId: id, userId: user.id } } } },
    });
  }

  async getFollowers(id: string, page = 1, size = 10) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { id },
      select: {
        followers: {
          take: size,
          select: {
            user: {
              select: {
                email: true,
                givenName: true,
                familyName: true,
                picture: true,
              },
            },
          },
          skip: (page - 1) * size,
        },
      },
    });

    if (!organizer) {
      throw new NotFoundException('Organizer is not found');
    }

    return organizer.followers;
  }

  async getEvents(getEventDto: GetEventDto, user: RequestUser) {
    const query: Prisma.EventFindManyArgs = {
      take: this.EVENTS_PAGE_SIZE,
      skip: this.EVENTS_PAGE_SIZE * (getEventDto.page - 1),
      where: {
        organizerId: user.organizer.id,
      },
      include: {
        _count: {
          select: {
            looks: true,
          },
        },
      },
    };

    if (getEventDto.status) {
      if (getEventDto.status === 'ended') {
        query.where.startDate = {
          lte: new Date(),
        };
      } else if (getEventDto.status === 'upcoming') {
        query.where.startDate = {
          gte: new Date(),
        };
      }
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany(query),
      this.prisma.event.count({ where: query.where }),
    ]);

    return { events, total };
  }

  async getTickets(page: number, user: RequestUser) {
    const organizer = await this.prisma.organizer.findUnique({ where: { id: user.organizer.id } });

    if (!organizer) {
      throw new NotFoundException('Organizer is not found');
    }

    if (organizer.id !== user.organizer.id) {
      throw new ForbiddenException('User is not the owner of the organizer');
    }

    const query: Prisma.TicketFindManyArgs = {
      take: this.TICKETS_PAGE_SIZE,
      skip: this.TICKETS_PAGE_SIZE * (page - 1),
      where: {
        event: { organizerId: organizer.id },
      },
      include: { event: { select: { title: true, startDate: true, isCancelled: true } } },
      orderBy: { updatedAt: 'desc' },
    };

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany(query),
      this.prisma.ticket.count({ where: query.where }),
    ]);

    return { tickets, total };
  }
}
