import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { DBRateLimiterService } from 'src/common/db-rate-limiter.service';

@Injectable()
export class DbRateLimiterGuard implements CanActivate {
  private readonly oneMinuteInMills = 60 * 1000;
  constructor(private readonly service: DBRateLimiterService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const client = request.consumer;

    if (!client) {
      throw new UnauthorizedException('Missing client id from request');
    }

    const now = Date.now();
    const limit = client.rateLimit.bucketCapacity;

    let cacheResult = await this.service.getCache(client.id);

    if (!cacheResult) {
      await this.service.setCache({
        key: client.id,
        count: 1,
        startTime: now,
      });

      return true;
    }

    const timeElapsedSinceLastRequest = now - cacheResult.startTime;

    if (timeElapsedSinceLastRequest >= this.oneMinuteInMills) {
      await this.service.setCache({
        key: client.id,
        count: 1,
        startTime: now,
      });

      return true;
    }

    if (cacheResult.count >= limit) {
      throw new HttpException({ error: 'rate limit exceeded' }, 429);
    }

    cacheResult = {
      ...cacheResult,
      count: cacheResult.count + 1,
    };

    await this.service.setCache(cacheResult);

    return true;
  }
}
