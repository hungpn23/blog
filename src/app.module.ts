import configuration from '@/configs/configuration';
import { ThrottlerConfig } from '@/configs/throttler.config';
import { TypeormConfig } from '@/configs/typeorm.config';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Modules } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      // Use useFactory, useClass, or useExisting
      // to configure the DataSourceOptions.
      useClass: TypeormConfig,
      dataSourceFactory: async (options) => {
        if (!options) throw new Error('Invalid DataSourceOptions value');

        return await new DataSource(options).initialize();
      },
    }),

    // https://docs.nestjs.com/security/rate-limiting#async-configuration
    ThrottlerModule.forRootAsync({ useClass: ThrottlerConfig }),

    CacheModule.register({ isGlobal: true }),

    Modules,
  ],
})
export class AppModule {}
