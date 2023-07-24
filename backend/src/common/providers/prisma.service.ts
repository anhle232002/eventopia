import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();

    function slugify(str) {
      // Remove special characters
      const cleanedStr = str.replace(/[^\w\s-]/g, '');

      // Convert spaces to hyphens
      const slug = cleanedStr.replace(/\s+/g, '-');

      // Convert to lowercase
      return slug.toLowerCase();
    }

    this.$use(async (params, next) => {
      let result = await next(params);

      if (params.model === 'Event' && params.action === 'create') {
        result = await this.event.update({
          where: { id: result.id },
          data: { slug: slugify(`${result.title} ${result.id}`) },
        });
      }

      return result;
    });

    // After update trigger
    /**
     * CREATE TRIGGER before_update_event
      BEFORE UPDATE ON Event
      FOR EACH ROW
      BEGIN
        DECLARE modified_title VARCHAR(255);
        SET modified_title = REPLACE(LOWER(NEW.title), ' ', '-');
        SET NEW.slug = CONCAT(modified_title, '-', NEW.id);
      END;
     */
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
