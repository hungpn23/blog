import { ToLowerCase } from '@/decorators/transforms.decorator';
import { IsPassword } from '@/decorators/validators/is-password.decorator';
import { type Uuid } from '@/types/branded.type';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';

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
  @ApiProperty({ type: () => String })
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
