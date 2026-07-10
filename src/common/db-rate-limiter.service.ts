import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DBRateLimiterEntity } from './entities/db-rate-limiter.entity';

@Injectable()
export class DBRateLimiterService {
  constructor(
    @InjectRepository(DBRateLimiterEntity)
    private readonly repository: Repository<DBRateLimiterEntity>,
  ) {}

  getCache(key: string) {
    return this.repository.findOneBy({
      key,
    });
  }

  setCache(data: Partial<DBRateLimiterEntity>) {
    return this.repository.upsert(
      {
        count: data.count,
        key: data.key,
        startTime: data.startTime,
      },
      ['key'],
    );
  }
}
