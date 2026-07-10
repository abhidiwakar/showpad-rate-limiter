import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBRateLimiterService } from './db-rate-limiter.service';
import { DBRateLimiterEntity } from './entities/db-rate-limiter.entity';
import { DbRateLimiterGuard } from 'src/guards/dbrate-limiter.guard';

@Module({
  imports: [TypeOrmModule.forFeature([DBRateLimiterEntity])],
  providers: [DBRateLimiterService, DbRateLimiterGuard],
  exports: [DBRateLimiterService],
})
export class CommonModule {}
