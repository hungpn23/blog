import {
  NumberValidators,
  StringValidators,
} from '@/decorators/properties.decorator';
import { validateConfig } from '@/utils/validate-config';
import process from 'node:process';

export class DatabaseEnvVariables {
  @StringValidators()
  DATABASE_TYPE: string;

  @StringValidators()
  DATABASE_HOST: string;

  @NumberValidators({ isInt: true, min: 1, max: 65535 })
  DATABASE_MASTER_PORT: number;

  @NumberValidators({ isInt: true, min: 1, max: 65535 })
  DATABASE_SLAVE_PORT: number;

  @StringValidators()
  DATABASE_USERNAME: string;

  @StringValidators()
  DATABASE_PASSWORD: string;

  @StringValidators()
  DATABASE_DATABASE_NAME: string;

  @StringValidators()
  DATABASE_TIMEZONE: string;
}

// config factory
export default () => {
  validateConfig(process.env, DatabaseEnvVariables);

  return {
    DATABASE_TYPE: process.env.DATABASE_TYPE,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_MASTER_PORT: +process.env.DATABASE_MASTER_PORT,
    DATABASE_SLAVE_PORT: +process.env.DATABASE_SLAVE_PORT,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_DATABASE_NAME: process.env.DATABASE_DATABASE_NAME,
    DATABASE_TIMEZONE: process.env.DATABASE_TIMEZONE,
  };
};
