import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeder, SeederOptions } from 'typeorm-extension';
import { MainSeeder } from './seeds';

(async () => {
  const options = {
    type: process.env.DATABASE_TYPE,
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    dropSchema: process.env.DATABASE_DROPSCHEMA === 'true',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    poolSize: +process.env.DATABASE_POOL_SIZE,
  } as DataSourceOptions;

  const seederOptions = {
    seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
    factories: [__dirname + '/factories/**/*{.ts,.js}'],
    seedTracking: true,
  } as SeederOptions;

  const dataSource = new DataSource(options);
  await dataSource.initialize();
  await runSeeder(dataSource, MainSeeder, seederOptions);
})();
