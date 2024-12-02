import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import process from 'node:process';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export default () => ({
  app: {
    port: +process.env.APP_PORT || 3000,
    url: process.env.APP_URL || 'http://localhost:3000',
    prefix: process.env.APP_PREFIX || '/api',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || '*',
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  database: {
    type: process.env.DATABASE_TYPE || 'mysql',
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
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
  } as TypeOrmModuleOptions as MysqlConnectionOptions,

  auth: {
    secret: process.env.AUTH_JWT_SECRET || 'secret',
    expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN || '1d',
    refreshSecret: process.env.AUTH_REFRESH_SECRET || 'refreshSecret',
    refreshExpiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN || '7d',
  },

  throttler: {
    ttl: process.env.THROTTLER_TTL_IN_SECONDS || 1,
    limit: process.env.THROTTLER_LIMIT || 100,
  },
});
