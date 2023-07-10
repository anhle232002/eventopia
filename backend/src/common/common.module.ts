import { BullModule } from '@nestjs/bull';
import { Module, Provider } from '@nestjs/common';
import { OptionalJWT } from './guards/optional-jwt.guard';
import { CloudinaryService } from './providers/cloudinary/cloudinary.service';
import { GeocodingServiceImpl } from './providers/geocoding/geocoding.service';
import { NotificationProcessor } from './providers/notification/notification.processor';
import { NotificationServiceImpl } from './providers/notification/notification.service';
import { PrismaService } from './providers/prisma.service';
import { RedisCacheManager } from './providers/redis/redis.service';
import { StripeService } from './providers/stripe.service';
import { UtilService } from './providers/util.service';

const services: Provider[] = [
  CloudinaryService,
  NotificationProcessor,
  PrismaService,
  StripeService,
  UtilService,
  RedisCacheManager,
  {
    provide: 'NotificationService',
    useClass: NotificationServiceImpl,
  },
  {
    provide: 'GeocodingService',
    useClass: GeocodingServiceImpl,
  },
];

@Module({
  providers: services,
  exports: services,
  imports: [BullModule.registerQueue({ name: 'notification' })],
})
export class CommonModule {}
