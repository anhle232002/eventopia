import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  protected isRequestCacheable(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const excludePaths = this.reflector.get<string[]>('exclude-cache', context.getHandler());
    const isAllowedMethods = this.allowedMethods.includes(request.method);
    let isAllowedPath = true;

    if (excludePaths) {
      isAllowedPath = excludePaths?.every((excludePath) => !request.originalUrl.includes(excludePath));
    }

    return isAllowedMethods && isAllowedPath;
  }
}
