import { StringValidators } from '@/decorators/properties.decorator';
import { validateConfig } from '@/utils/validate-config';
import { registerAs } from '@nestjs/config';
import process from 'node:process';

export class AuthEnvVariables {
  @StringValidators()
  AUTH_JWT_SECRET: string;

  @StringValidators()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @StringValidators()
  AUTH_REFRESH_SECRET: string;

  @StringValidators()
  AUTH_REFRESH_TOKEN_EXPIRES_IN: string;
}

// config namespace
export default registerAs<AuthEnvVariables>('auth', () => {
  validateConfig(process.env, AuthEnvVariables);

  return {
    AUTH_JWT_SECRET: process.env.AUTH_JWT_SECRET,
    AUTH_JWT_TOKEN_EXPIRES_IN: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    AUTH_REFRESH_SECRET: process.env.APP_PORT,
    AUTH_REFRESH_TOKEN_EXPIRES_IN: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
  };
});
