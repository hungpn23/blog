import { IS_REFRESH_TOKEN } from '@/constants';
import { SetMetadata } from '@nestjs/common';

export const RefreshToken = () => SetMetadata(IS_REFRESH_TOKEN, true);
