import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default function swaggerConfig(
  app: INestApplication,
  configService: ConfigService,
) {
  const appName = configService.getOrThrow<string>('app.name');

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('a blog api project')
    .setVersion('1.0')
    .setContact('Blog', 'https://example.com', 'hungpn23@gmail.com')
    .addBearerAuth()
    .addBasicAuth()
    .addServer(configService.getOrThrow('app.url'), 'Application Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: appName,
  });
}
