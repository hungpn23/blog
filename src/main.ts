import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { AppEnvVariables } from './configs/app.config';
import swaggerConfig from './configs/swagger.config';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { AuthService } from './modules/auth/auth.service';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { secureApiDocs } from './utils/secure-docs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true, // buffering logs before nestjs-pino logger ready
  });
  const configService = app.get(ConfigService<AppEnvVariables, true>);

  // ================= middlewares =================
  app.use(helmet());
  app.use(compression());

  // ================= configs =================
  const appUrl = configService.get('APP_URL');
  app.enableCors({
    origin: [appUrl, 'http://localhost:5173'],
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.enableVersioning({ type: VersioningType.URI });

  // ================= apply global components & logger  =================
  const logger = app.get(Logger);
  app.useLogger(logger);

  app.setGlobalPrefix(configService.get('APP_PREFIX'));

  app.useGlobalGuards(new AuthGuard(app.get(Reflector), app.get(AuthService)));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  // ================= swagger =================
  secureApiDocs(app.getHttpAdapter());
  // app.useStaticAssets('served'); // https://trilon.io/blog/nestjs-swagger-tips-tricks#pre-authentication
  await swaggerConfig(app, configService);

  // ================= start app =================
  await app.listen(configService.get('APP_PORT'));
  logger.log(`🚀🚀🚀 App is running on: ${appUrl}`);
}

void bootstrap();
