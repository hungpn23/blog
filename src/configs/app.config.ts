import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  seconds,
  ThrottlerOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { IncomingMessage, ServerResponse } from 'http';

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

  static loggerFactory() {
    return {
      pinoHttp: {
        messageKey: 'msg',

        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore:
              'req.id,req.method,req.url,req.headers,req.remoteAddress,req.remotePort,res.headers',
          },
        },

        customReceivedMessage: (req: IncomingMessage) => {
          return `[${req.id || '*'}] "${req.method} ${req.url}"`;
        },

        customSuccessMessage: (
          req: IncomingMessage,
          res: ServerResponse<IncomingMessage>,
          responseTime: number,
        ) => {
          return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - ${responseTime} ms`;
        },

        customErrorMessage: (
          req: IncomingMessage,
          res: ServerResponse<IncomingMessage>,
          err: Error,
        ) => {
          return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - message: ${err.message}`;
        },
      },
    };
  }
}
