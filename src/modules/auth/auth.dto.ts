import { Uuid } from '@/types';
import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthReqDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

@Expose()
export class AuthResDto {
  userId: Uuid;
  accessToken: string;
  refreshToken: string;
}

@Expose()
export class RegisterResDto extends PickType(AuthResDto, ['userId'] as const) {}

@Expose()
export class LoginResDto extends AuthResDto {}

@Expose()
export class RefreshResDto extends PickType(AuthResDto, [
  'accessToken',
] as const) {}
