import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { DatabaseNamingStrategy } from './name-strategy';

export const dataSource = new DataSource({
  type: 'mysql',
  // replication: {
  //   master: {
  //     host: process.env.DATABASE_HOST,
  //     port: +process.env.DATABASE_MASTER_PORT,
  //     username: process.env.DATABASE_USERNAME,
  //     password: process.env.DATABASE_PASSWORD,
  //     database: process.env.DATABASE_DATABASE_NAME,
  //   },
  //   slaves: [
  //     {
  //       host: process.env.DATABASE_HOST,
  //       port: +process.env.DATABASE_SLAVE_PORT,
  //       username: process.env.DATABASE_USERNAME,
  //       password: process.env.DATABASE_PASSWORD,
  //       database: process.env.DATABASE_DATABASE_NAME,
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
  timezone: process.env.DATABASE_TIMEZONE,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  namingStrategy: new DatabaseNamingStrategy(),

  seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
  factories: [__dirname + '/factories/**/*{.ts,.js}'],
  seedTracking: true,
} as MysqlConnectionOptions & DataSourceOptions & SeederOptions);
