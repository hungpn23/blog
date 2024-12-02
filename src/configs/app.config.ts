import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  seconds,
  ThrottlerOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { IncomingMessage, ServerResponse } from 'http';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

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
      replication: {
        master: {
          host: this.configService.getOrThrow(
            'database.replication.master.host',
          ),
          port: this.configService.getOrThrow(
            'database.replication.master.port',
          ),
          username: this.configService.getOrThrow(
            'database.replication.master.username',
          ),
          password: this.configService.getOrThrow(
            'database.replication.master.password',
          ),
          database: this.configService.getOrThrow(
            'database.replication.master.database',
          ),
        },
        slaves: [
          {
            host: this.configService.getOrThrow(
              'database.replication.slaves[0].host',
            ),
            port: this.configService.getOrThrow(
              'database.replication.slaves[0].port',
            ),
            username: this.configService.getOrThrow(
              'database.replication.slaves[0].username',
            ),
            password: this.configService.getOrThrow(
              'database.replication.slaves[0].password',
            ),
            database: this.configService.getOrThrow(
              'database.replication.slaves[0].database',
            ),
          },
        ],
      },
      synchronize: this.configService.getOrThrow('database.synchronize'),
      logging: this.configService.getOrThrow('database.logging'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../**/migrations/**/*.{.ts,.js}'],
    } as MysqlConnectionOptions as TypeOrmModuleOptions;
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
