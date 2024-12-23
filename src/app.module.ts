import {
  CacheInterceptor,
  CacheModule,
  CacheStore,
} from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisStore, redisStore } from 'cache-manager-redis-yet';
import { IncomingMessage, ServerResponse } from 'http';
import { LoggerModule } from 'nestjs-pino';
import { DataSource } from 'typeorm';
import appConfig from './configs/app.config';
import authConfig from './configs/auth.config';
import cloudinaryConfig from './configs/cloudinary.config';
import databaseConfig from './configs/database.config';
import redisConfig, { RedisEnvVariables } from './configs/redis.config';
import throttlerConfig, {
  ThrottlerEnvVariables,
} from './configs/throttler.config';
import { DatabaseNamingStrategy } from './database/name-strategy';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { Modules as ApiModule } from './modules';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [
        appConfig,
        databaseConfig,
        throttlerConfig,
        authConfig,
        cloudinaryConfig,
        redisConfig,
      ],
      cache: true, // speed up the loading process
      expandVariables: true, // support variables in .env file
    }),

    TypeOrmModule.forRootAsync({
      // configure the DataSourceOptions.
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        if (!options) throw new Error('Invalid DataSourceOptions value');

        return await new DataSource({
          ...options,
          namingStrategy: new DatabaseNamingStrategy(),
        }).initialize();
      },
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            ignore: 'req,res,responseTime',
            singleLine: true,
          },
        },
        name: 'NestJS',

        customReceivedMessage: (req: IncomingMessage) => {
          return `REQUEST(${req.id}) ${req.method} ${req.headers['host']}${req.url}`;
        },

        customSuccessMessage: (
          req: IncomingMessage,
          res: ServerResponse<IncomingMessage>,
          responseTime: number,
        ) => {
          return `RESPONSE(${req.id}) ${res.statusCode} - ${responseTime} ms`;
        },
      },
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ThrottlerEnvVariables>) => [
        {
          ttl: configService.get('THROTTLER_TTL_IN_SECONDS', { infer: true }),
          limit: configService.get('THROTTLER_LIMIT', { infer: true }),
        },
      ],
    }),

    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<RedisEnvVariables>) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST', { infer: true }),
            port: configService.get('REDIS_PORT', { infer: true }),
          },
          username: configService.get('REDIS_USERNAME', { infer: true }),
          password: configService.get('REDIS_PASSWORD', { infer: true }),
          ttl: 30000,
        });

        return {
          store: store as RedisStore as CacheStore,
        };
      },
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    EventEmitterModule.forRoot(),

    CloudinaryModule,

    ApiModule,
  ],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: CacheInterceptor, // auto cache responses
    },
  ],
})
export class AppModule {}
