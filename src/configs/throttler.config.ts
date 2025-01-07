import { NumberValidators } from '@/decorators/properties.decorator';
import { validateConfig } from '@/utils/validate-config';
import process from 'node:process';

export class ThrottlerEnvVariables {
  @NumberValidators({ isInt: true, min: 1 })
  THROTTLER_TTL_IN_SECONDS: number;

  @NumberValidators({ isInt: true, min: 1 })
  THROTTLER_LIMIT: number;
}

// config factory
export default () => {
  validateConfig(process.env, ThrottlerEnvVariables);

  return {
    THROTTLER_TTL_IN_SECONDS: +process.env.THROTTLER_TTL_IN_SECONDS,
    THROTTLER_LIMIT: +process.env.THROTTLER_LIMIT,
  };
};
