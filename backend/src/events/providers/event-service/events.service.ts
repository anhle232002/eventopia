import { InjectQueue } from '@nestjs/bull';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Event, Prisma } from '@prisma/client';
import { CronJob } from 'cron';
import { Queue } from 'bull';
import { Role } from 'src/common/constants/role.enum';
import { PrismaService } from 'src/common/providers/prisma.service';
import { RequestUser } from 'src/users/users.dto';
import { CreateEventDto, EmailReceiver, GetEventsQuery, ImageUrl, UpdateEventDto } from '../../events.dto';
import { UtilService } from 'src/common/providers/util.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisCache } from 'cache-manager-redis-yet';
import { GeocodingService } from 'src/common/providers/geocoding/geocoding.service';
import { CloudinaryService } from 'src/common/providers/cloudinary/cloudinary.service';
import { EmailNotification } from 'src/common/providers/notification/notification.service';
import { EventQueryBuilder } from '../event-query-builder/EventQueryBuilder';
import { UsersService } from 'src/users/users.service';
import { EventNotifcationService } from 'src/common/providers/notification/event-notification/event-notification.service';
import { add } from 'date-fns';

@Injectable()
export class EventsService {
  private PAGE_SIZE = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudiaryService: CloudinaryService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly utilService: UtilService,
    private readonly usersSerivce: UsersService,
    private readonly eventNotificationService: EventNotifcationService,
    @Inject('GeocodingService') private readonly geocodingService: GeocodingService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: RedisCache,
    @InjectQueue('notification') private readonly queue: Queue,
  ) {}

  async getEvents(
    { page, date, online, organizer, lat, long, search, category, fo }: GetEventsQuery,
    user?: RequestUser,
  ) {
    const queryBuilder = new EventQueryBuilder();

    queryBuilder
      .withPaginate(page)
      .withDateRange(this.utilService.getDateRange(date))
      .withCategory(category)
      .withOnlyOnlineEvent(!!online)
      .withOrganizer(organizer)
      .withSearchTerm(search);

    if (lat && long) {
      const locationData = await this.geocodingService.getLocation(lat, long);

      queryBuilder.withLocation(locationData);
    }

    if (fo) {
      if (!user) throw new BadRequestException('Cannot get followed organizers with unauthenticated user');

      const followedOrganizers = await this.usersSerivce.getFollowedOrganizers(user.id);
      const followedOrganizersIds = followedOrganizers.map((o) => o.organizerId);

      queryBuilder.withFollowedOrganizers(followedOrganizersIds);
    }

    const query = queryBuilder.build();

    const [events, total] = await Promise.all([
      this.prisma.event.findMany(query),
      this.prisma.event.count({ where: query.where }),
    ]);

    return { events, total };
  }

  async getEvent(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            email: true,
            picture: true,
            name: true,
            id: true,
            _count: { select: { followers: true } },
          },
        },
        reviews: true,
        categories: true,
        _count: { select: { looks: true } },
      },
    });

    return event;
  }

  async createEvent(createEventDto: CreateEventDto, imageFiles: Express.Multer.File[]) {
    if (imageFiles && imageFiles.length > 0) {
      const imageUrls = await this.cloudiaryService.uploadImages(imageFiles);

      createEventDto.images = imageUrls;
    }

    const organizer = await this.prisma.organizer.findUnique({
      where: { id: createEventDto.organizerId },
      select: { id: true },
    });

    if (!organizer) throw new ForbiddenException('User is not organizer');

    const event = await this.prisma.event.create({
      data: { ...createEventDto, images: createEventDto.images as any[] as Prisma.JsonArray },
    });

    // TODO: remove old schedule function
    // this.scheduleNotificationEmail(event);
    this.eventNotificationService.schedule(
      `event:notification:${event.id}`,
      () => this.eventNotificationService.sendEventReminderNotification(event),
      add(new Date(), { days: -1 }),
    );

    return event;
  }

  async deleteEvent(eventId: number, user: RequestUser) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, organizer: { select: { id: true } } },
    });
    const owner = await this.prisma.organizer.findUnique({
      where: { id: user.organizer.id },
      select: { id: true },
    });

    if (!owner) throw new ForbiddenException('User is not organizer');

    if (!event) throw new NotFoundException('Event does not exist');

    if (event.organizer.id !== owner.id) {
      throw new ForbiddenException('User is not organizer');
    }

    return this.prisma.event.delete({ where: { id: eventId } });
  }

  async updateEvent(
    id: number,
    updateEventDto: UpdateEventDto,
    user: RequestUser,
    imageFiles?: Express.Multer.File[],
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select: {
        id: true,
        description: true,
        shortDescription: true,
        duration: true,
        location: true,
        images: true,
        sold: true,
        totalTickets: true,
        organizer: {
          select: {
            id: true,
          },
        },
      },
    });
    const organizer = await this.prisma.organizer.findUnique({ where: { id: user.organizer.id } });

    if (!organizer) throw new ForbiddenException('User is not organizer');

    if (!event) throw new NotFoundException('Event does not exist');

    if (event.organizer.id !== organizer.id || user.role !== Role.Organizer) throw new ForbiddenException();

    if (updateEventDto.totalTickets && updateEventDto.totalTickets <= event.sold)
      throw new BadRequestException('Total tickets must be larger than current sold');

    if (imageFiles && imageFiles.length > 0) {
      const imageUrls = await this.cloudiaryService.uploadImages(imageFiles);

      updateEventDto.images = imageUrls.concat(event.images as []);
    }

    if (updateEventDto.removedImages) {
      if (!updateEventDto.images) {
        updateEventDto.images = event.images as any[] as ImageUrl[];
      }
      // Set of public image ids that user want to remove
      const removedImages = new Set(updateEventDto.removedImages);

      updateEventDto.images = (updateEventDto.images as ImageUrl[]).filter((image: ImageUrl) => {
        return !removedImages.has(image.publicId) || !image.publicId;
      });

      this.cloudiaryService.removeImages(updateEventDto.removedImages);
    }

    delete updateEventDto.removedImages;

    const updatedEvent = await this.prisma.event.update({
      data: { ...updateEventDto, images: updateEventDto.images as any[] as Prisma.JsonValue },
      where: { id },
    });

    // Start date has been changed, need to reschedule the notification email
    if (updateEventDto.startDate && updateEventDto.startDate !== updatedEvent.startDate) {
      // TODO: remove
      // this.scheduleNotificationEmail(updatedEvent);
      this.eventNotificationService.schedule(
        `event:notification:${updatedEvent.id}`,
        () => this.eventNotificationService.sendEventReminderNotification(updatedEvent),
        add(new Date(), { days: -1 }),
      );
    }

    return updatedEvent;
  }

  /**
   * Check if event is exist and event is not ended and can buy ticket
   * @param eventId
   * @returns true | false
   */
  async isEventAvailable(eventId: number) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        startDate: true,
        duration: true,
        totalTickets: true,
        sold: true,
      },
    });

    if (!event) return { available: false, message: 'Event does not exist', event: null };

    if (new Date(event.startDate).getTime() < Date.now())
      return { available: false, message: 'Event has already ended', event: null };

    if (event.totalTickets <= event.sold) {
      return {
        available: false,
        message: 'Event tickets is sold out',
        event: null,
      };
    }

    return { available: true, message: 'Event is available', event };
  }

  async lookForwardToEvent(eventId: number, user: RequestUser) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { startDate: true, looks: { where: { userId: user.id } } },
    });

    if (!event) throw new HttpException('Event does not exist', 404);

    if (new Date(event.startDate).getTime() < Date.now()) {
      throw new HttpException('Event has already ended', 400);
    }

    // Already looked
    if (event.looks.length > 0) return;

    return this.prisma.event.update({
      where: { id: eventId },
      data: { looks: { create: { user: { connect: { id: user.id } } } } },
    });
  }

  async unlookEvent(eventId: number, user: RequestUser) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { startDate: true, looks: { where: { userId: user.id } } },
    });

    if (!event) {
      throw new HttpException('Event does not exist', 404);
    }

    // Already unlooked
    if (event.looks.length === 0) return;

    return this.prisma.event.update({
      where: { id: eventId },
      data: { looks: { delete: { eventId_userId: { eventId: eventId, userId: user.id } } } },
    });
  }

  async cancelEvent(eventId: number, user: RequestUser) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { startDate: true, looks: { where: { userId: user.id } }, organizerId: true },
    });

    if (!event) {
      throw new HttpException('Event does not exist', 404);
    }

    if (event.organizerId !== user.organizer.id) {
      throw new ForbiddenException('User is not organizer of this event');
    }

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        isCancelled: true,
      },
    });
  }

  releaseReservedTickets(eventId: number, quantity: number) {
    return this.prisma.event.update({ where: { id: eventId }, data: { sold: { decrement: quantity } } });
  }

  async scheduleNotificationEmail(event: Partial<Event>, before: number = 60 * 60 * 1000) {
    if (this.schedulerRegistry.doesExist('cron', `${event.id}-notification`)) {
      this.schedulerRegistry.deleteCronJob(`${event.id}-notification`);
    }

    const date = new Date(event.startDate).getTime() - before; // Notify user before event start time 1 hour
    const job = new CronJob(new Date(date), async () => {
      const { tickets: receivers } = await this.prisma.event.findUnique({
        where: { id: event.id },
        select: {
          tickets: { select: { customerEmail: true, customerName: true }, distinct: ['customerEmail'] },
        },
      });

      this.sendEventNotificationEmails(event, receivers);
    });

    this.schedulerRegistry.addCronJob(`${event.id}-notification`, job);

    job.start();
  }

  sendEventNotificationEmails(event: Partial<Event>, users: EmailReceiver[]) {
    users.forEach(({ customerEmail, customerName }) => {
      const startDate = this.utilService.formatLocaleDate(event.startDate);
      const notification: EmailNotification = {
        to: customerEmail,
        template: 'notification',
        context: {
          username: customerName,
          eventName: event.title,
          eventDate: startDate,
          eventLocation: event.location,
        },
      };

      this.queue.add('send-email', { notification });
    });
  }

  async getTotalCount() {
    const cachedEventsCount = await this.cacheManager.get('events.total');

    if (cachedEventsCount) return cachedEventsCount;

    const eventsCount = await this.prisma.event.count();

    this.cacheManager.set('events.total', eventsCount, 10 * 60 * 60 * 1000);

    return eventsCount;
  }

  getDateQuery(type: string) {
    switch (type) {
      case 'today': {
        const { start, end } = this.utilService.getTodayRange();
        return {
          gte: start,
          lte: end,
        };
      }

      case 'this_week': {
        const { start, end } = this.utilService.getThisWeekRange();
        return {
          gte: start,
          lte: end,
        };
      }

      case 'this_month': {
        const { start, end } = this.utilService.getThisMonthRange();
        return {
          gte: start,
          lte: end,
        };
      }

      default: {
        return null;
      }
    }
  }
}
