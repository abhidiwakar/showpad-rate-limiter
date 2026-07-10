import { Controller, Get, UseGuards } from '@nestjs/common';
import { FooService } from './foo.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { InMemoryRateLimiterGuard } from 'src/guards/in-memory-rate-limiter.guard';

@UseGuards(AuthGuard)
@Controller('foo')
export class FooController {
  constructor(private readonly fooService: FooService) {}

  @UseGuards(InMemoryRateLimiterGuard)
  @Get()
  findAll() {
    return this.fooService.findAll();
  }
}
