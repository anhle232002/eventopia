import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RedisCache } from 'cache-manager-redis-yet';

@Injectable()
export class RedisCacheManager {
  constructor(@Inject(CACHE_MANAGER) private readonly manager: RedisCache) {}

  async deleteKeysPrefix(prefix: string) {
    const keys = await this.manager.store.keys();
    const prefixKeys = keys.filter((key) => key.startsWith(prefix));
    const multi = this.manager.store.client.multi();

    // using multi and exec to achieve atomic operation
    prefixKeys.forEach((key) => {
      multi.del(key);
    });

    return await multi.exec();
  }
}
