import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  seconds,
  ThrottlerOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class AppConfig
  implements ThrottlerOptionsFactory, TypeOrmOptionsFactory
{
  constructor(private configService: ConfigService) {}

  createThrottlerOptions() {
    return [
      {
        ttl: seconds(this.configService.getOrThrow<number>('throttler.ttl')),
        limit: this.configService.getOrThrow<number>('throttler.limit'),
      },
    ] as Array<ThrottlerOptions>;
  }

  createTypeOrmOptions() {
    return {
      type: this.configService.getOrThrow('database.type'),
      host: this.configService.getOrThrow('database.host'),
      port: this.configService.getOrThrow('database.port'),
      username: this.configService.getOrThrow('database.username'),
      password: this.configService.getOrThrow('database.password'),
      database: this.configService.getOrThrow('database.name'),
      synchronize: this.configService.getOrThrow('database.synchronize'),
      logging: this.configService.getOrThrow('database.logging'),
      logger: this.configService.getOrThrow('database.logger'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../**/migrations/**/*.{.ts,.js}'],
    } as TypeOrmModuleOptions;
  }
}
