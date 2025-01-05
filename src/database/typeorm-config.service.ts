import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { DatabaseEnvVariables } from '../configs/database.config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<DatabaseEnvVariables>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('DATABASE_TYPE'),
      // replication: {
      //   master: {
      //     host: this.configService.get('DATABASE_HOST', { infer: true }),
      //     port: this.configService.get('DATABASE_MASTER_PORT', { infer: true }),
      //     username: this.configService.get('DATABASE_USERNAME', { infer: true }),
      //     password: this.configService.get('DATABASE_PASSWORD', { infer: true }),
      //     database: this.configService.get('DATABASE_DATABASE_NAME', { infer: true }),
      //   },
      //   slaves: [
      //     {
      //       host: this.configService.get('DATABASE_HOST', { infer: true }),
      //       port: this.configService.get('DATABASE_SLAVE_PORT', { infer: true }),
      //       username: this.configService.get('DATABASE_USERNAME', { infer: true }),
      //       password: this.configService.get('DATABASE_PASSWORD', { infer: true }),
      //       database: this.configService.get('DATABASE_DATABASE_NAME', { infer: true }),
      //     },
      //   ],
      // },
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_MASTER_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE_NAME,

      synchronize: true,
      logging: true,
      timezone: this.configService.get('DATABASE_TIMEZONE', { infer: true }),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../**/migrations/**/*.{.ts,.js}'],
    } as MysqlConnectionOptions as TypeOrmModuleOptions;
  }
}
