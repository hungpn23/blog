import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import swaggerConfig from './configs/swagger.config';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { AuthGuard } from './modules/auth/auth.guard';
import { AuthService } from './modules/auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: configService.getOrThrow<string>('cors.origin'),
    methods: configService.getOrThrow<string>('cors.methods'),
    allowedHeaders: configService.getOrThrow<string>('cors.allowedHeaders'),
    credentials: configService.getOrThrow<boolean>('cors.credentials'),
  });
  app.setGlobalPrefix(configService.getOrThrow('app.prefix'));

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

  swaggerConfig(app, configService);

  await app.listen(configService.getOrThrow('app.port'));
  console.info(`App is running on: ${configService.getOrThrow('app.url')}`);
}

void bootstrap();
