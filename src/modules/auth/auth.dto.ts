import { ToLowerCase } from '@/decorators/transforms.decorator';
import { IsPassword } from '@/decorators/validators/is-password.decorator';
import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';

// TODO: implement validator decoratos
export class AuthReqDto {
  @ToLowerCase()
  @IsEmail()
  email: string;

  @IsPassword()
  @MinLength(8)
  password: string;
}

@Expose()
export class AuthResDto {
  accessToken: string;
  refreshToken: string;
}

@Expose()
export class LoginResDto extends AuthResDto {}

@Expose()
export class RefreshResDto extends PickType(AuthResDto, [
  'accessToken',
] as const) {}
