import { ToLowerCase } from '@/decorators/transforms.decorator';
import { IsPassword } from '@/decorators/validators/is-password.decorator';
import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';
import { UserEntity } from '../user/entities/user.entity';

export class AuthReqDto {
  @ToLowerCase()
  @IsEmail()
  email: string;

  @IsPassword()
  @MinLength(8)
  password: string;
}

/**
 * @deprecated
 */
@Expose()
export class AuthResDto {
  user: UserEntity;
  accessToken: string;
  refreshToken: string;
}

/**
 * @deprecated
 */
@Expose()
export class LoginResDto extends AuthResDto {}

/**
 * @deprecated
 */
@Expose()
export class RefreshResDto extends PickType(AuthResDto, [
  'accessToken',
] as const) {}
