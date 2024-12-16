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
    .setDescription(`### A blog api documentation using NestJS `)
    .addServer(configService.getOrThrow('app.url'), 'Application Server')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: appName,
    customJs: '/swagger-custom.js',
    swaggerOptions: {
      // https://trilon.io/blog/nestjs-swagger-tips-tricks#preauth-alternatives
      persistAuthorization: true,
    },
  });
}
