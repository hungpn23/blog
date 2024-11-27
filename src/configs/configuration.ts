import process from 'node:process';

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
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: +process.env.DATABASE_PORT || 3306,
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'password',
    name: process.env.DATABASE_NAME || 'sys',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
    logger: process.env.DATABASE_LOGGER || 'advanced-console',
  },

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
