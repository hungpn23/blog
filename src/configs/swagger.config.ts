import metadata from '@/metadata';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default async function swaggerConfig(
  app: INestApplication,
  configService: ConfigService,
) {
  await SwaggerModule.loadPluginMetadata(metadata);

  const appName = configService.getOrThrow<string>('app.name');

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('a blog api project')
    .setVersion('1.0')
    .setContact('Blog', 'https://example.com', 'example@gmail.com')
    .addBearerAuth()
    .addServer(configService.getOrThrow('app.url'), 'Application Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: appName,
    swaggerOptions: { persistAuthorization: true },
  });
}
