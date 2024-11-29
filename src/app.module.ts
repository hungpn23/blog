import configuration from '@/configs/configuration';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppConfig } from './configs/app.config';
import { DatabaseNamingStrategy } from './database/name-strategy';
import { Modules as ApiModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      // configure the DataSourceOptions.
      useClass: AppConfig,
      dataSourceFactory: async (options) => {
        if (!options) throw new Error('Invalid DataSourceOptions value');

        return await new DataSource({
          ...options,
          namingStrategy: new DatabaseNamingStrategy(),
        }).initialize();
      },
    }),

    ThrottlerModule.forRootAsync({ useClass: AppConfig }),

    CacheModule.register({ isGlobal: true }),

    ApiModule,
  ],
})
export class AppModule {}
