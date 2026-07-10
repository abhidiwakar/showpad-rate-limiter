import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { Request } from 'express';
import { BucketRateLimiterValue } from 'src/@types/rate-limiter';

@Injectable()
export class InMemoryRateLimiterGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const client = request.consumer;

    if (!client) {
      throw new UnauthorizedException('Client ID missing from request!');
    }

    const cacheKey = `throttle:${client.id}`;

    let cacheResult =
      await this.cacheService.get<BucketRateLimiterValue>(cacheKey);

    if (!cacheResult) {
      cacheResult = {
        lastCheck: Date.now(),
        remainingTokens: client.rateLimit.bucketCapacity,
      };

      await this.cacheService.set(cacheKey, cacheResult);
    }

    const secondsElapsedSinceLastCheck = Math.floor(
      (Date.now() - cacheResult.lastCheck) / 1000,
    );

    const tokenToAdd = Math.min(
      client.rateLimit.bucketCapacity,
      secondsElapsedSinceLastCheck * client.rateLimit.refillRate,
    );

    cacheResult = {
      lastCheck: Date.now(),
      remainingTokens: Math.min(
        client.rateLimit.bucketCapacity,
        cacheResult.remainingTokens + tokenToAdd,
      ),
    };

    if (cacheResult.remainingTokens <= 0) {
      await this.cacheService.set(cacheKey, cacheResult);
      throw new HttpException({ error: 'rate limit exceeded' }, 429);
    }

    await this.cacheService.set(cacheKey, {
      ...cacheResult,
      remainingTokens: cacheResult.remainingTokens - 1,
    });

    return true;
  }
}
