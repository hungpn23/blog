import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import process from 'node:process';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export default () => ({
  app: {
    port: +process.env.APP_PORT,
    url: process.env.APP_URL,
    prefix: process.env.APP_PREFIX,
    name: process.env.APP_NAME,
  },

  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS,
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS,
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  database: {
    type: process.env.DATABASE_TYPE,
    replication: {
      master: {
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_MASTER_PORT,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB_NAME,
      },
      slaves: [
        {
          host: process.env.DATABASE_HOST,
          port: +process.env.DATABASE_SLAVE_PORT,
          username: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_DB_NAME,
        },
      ],
    },
    logging: process.env.DATABASE_LOGGING === 'true',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    timezone: process.env.DATABASE_TIMEZONE,
  } as TypeOrmModuleOptions as MysqlConnectionOptions,

  auth: {
    secret: process.env.AUTH_JWT_SECRET,
    expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshSecret: process.env.AUTH_REFRESH_SECRET,
    refreshExpiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
  },

  throttler: {
    ttl: +process.env.THROTTLER_TTL_IN_SECONDS,
    limit: +process.env.THROTTLER_LIMIT,
  },
});
