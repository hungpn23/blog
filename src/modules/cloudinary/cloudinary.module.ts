import { CloudinaryEnvVariables } from '@/configs/cloudinary.config';
import { Provider } from '@/constants';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [
    CloudinaryService,
    {
      provide: Provider.CLOUDINARY,
      useFactory: (configService: ConfigService<CloudinaryEnvVariables>) => {
        return cloudinary.config({
          cloud_name: configService.get('CLOUDINARY_CLOUD_NAME', {
            infer: true,
          }),
          api_key: configService.get('CLOUDINARY_API_KEY', { infer: true }),
          api_secret: configService.get('CLOUDINARY_API_SECRET', {
            infer: true,
          }),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [CloudinaryService, Provider.CLOUDINARY],
  imports: [ConfigModule],
})
export class CloudinaryModule {}
