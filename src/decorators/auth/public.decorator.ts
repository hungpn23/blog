import { IS_PUBLIC_KEY } from '@/constants/index';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// cach 2
export const Public2 = Reflector.createDecorator<boolean>({
  key: IS_PUBLIC_KEY,
  transform: () => true,
});
