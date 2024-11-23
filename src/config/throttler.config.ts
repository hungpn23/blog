import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

@Injectable()
export class ThrottlerConfig implements ThrottlerOptionsFactory {
  constructor(private configService: ConfigService) {}
  async createThrottlerOptions(): Promise<ThrottlerModuleOptions> {
    return [
      {
        ttl: this.configService.getOrThrow<number>('throttler.ttl'),
        limit: this.configService.getOrThrow<number>('throttler.limit'),
      },
    ];
  }
}
