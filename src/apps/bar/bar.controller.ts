import { Controller, Get, UseGuards } from '@nestjs/common';
import { BarService } from './bar.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { DbRateLimiterGuard } from 'src/guards/dbrate-limiter.guard';

@UseGuards(AuthGuard)
@Controller('bar')
export class BarController {
  constructor(private readonly barService: BarService) {}

  @UseGuards(DbRateLimiterGuard)
  @Get()
  findAll() {
    return this.barService.findAll();
  }
}
