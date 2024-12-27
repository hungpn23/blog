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
      replication: {
        master: {
          host: this.configService.get('DATABASE_HOST'),
          port: this.configService.get('DATABASE_MASTER_PORT'),
          username: this.configService.get('DATABASE_USERNAME'),
          password: this.configService.get('DATABASE_PASSWORD'),
          database: this.configService.get('DATABASE_DATABASE_NAME'),
        },
        slaves: [
          {
            host: this.configService.get('DATABASE_HOST'),
            port: this.configService.get('DATABASE_SLAVE_PORT'),
            username: this.configService.get('DATABASE_USERNAME'),
            password: this.configService.get('DATABASE_PASSWORD'),
            database: this.configService.get('DATABASE_DATABASE_NAME'),
          },
        ],
      },
      synchronize: true,
      logging: true,
      timezone: this.configService.get('DATABASE_TIMEZONE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../**/migrations/**/*.{.ts,.js}'],
    } as MysqlConnectionOptions as TypeOrmModuleOptions;
  }
}
