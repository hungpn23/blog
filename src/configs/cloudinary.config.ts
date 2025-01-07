import { StringValidators } from '@/decorators/properties.decorator';
import { validateConfig } from '@/utils/validate-config';
import process from 'node:process';

export class CloudinaryEnvVariables {
  @StringValidators()
  CLOUDINARY_CLOUD_NAME: string;

  @StringValidators()
  CLOUDINARY_API_KEY: string;

  @StringValidators()
  CLOUDINARY_API_SECRET: string;
}

// config factory
export default () => {
  validateConfig(process.env, CloudinaryEnvVariables);

  return {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  };
};
