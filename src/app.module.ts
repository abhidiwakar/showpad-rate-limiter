import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { BarModule } from './apps/bar/bar.module';
import { FooModule } from './apps/foo/foo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    FooModule,
    BarModule,
    CommonModule,
  ],
})
export class AppModule {}
