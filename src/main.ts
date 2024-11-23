import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { AuthService } from './modules/auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  // apply global guards
  app.useGlobalGuards(new AuthGuard(app.get(Reflector), app.get(AuthService)));

  // apply global pipes
  app.useGlobalPipes(new ValidationPipe());

  // apply global interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
    }),
  );

  await app.listen(configService.getOrThrow('app.port'));
  console.info(`App is running on: ${configService.getOrThrow('app.url')}`);
}

void bootstrap();
