import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { Public } from '@/decorators/public.decorator';
import { RefreshToken } from '@/decorators/refresh-token.decorator';

import { Body, Controller, Get, Post, SerializeOptions } from '@nestjs/common';
import {
  AuthReqDto,
  LoginResDto,
  RefreshResDto,
  RegisterResDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { JwtPayloadType, JwtRefreshPayloadType } from './auth.type';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @SerializeOptions({ type: RegisterResDto })
  @Post('/register')
  async register(@Body() dto: AuthReqDto): Promise<RegisterResDto> {
    return await this.authService.register(dto);
  }

  @Public()
  @SerializeOptions({ type: LoginResDto })
  @Post('/login')
  async login(@Body() dto: AuthReqDto): Promise<LoginResDto> {
    return await this.authService.login(dto);
  }

  @Post('/logout')
  async logout(@JwtPayload() payload: JwtPayloadType) {
    return await this.authService.logout(payload);
  }

  @RefreshToken()
  @SerializeOptions({ type: RefreshResDto })
  @Post('/refresh')
  async refreshToken(
    @JwtPayload() payload: JwtRefreshPayloadType,
  ): Promise<RefreshResDto> {
    return await this.authService.refreshToken(payload);
  }

  // TODO -----------------------------
  @Post('forgot-password')
  async forgotPassword() {
    return 'forgot-password';
  }

  @Post('verify/forgot-password')
  async verifyForgotPassword() {
    return 'verify-forgot-password';
  }

  @Post('reset-password')
  async resetPassword() {
    return 'reset-password';
  }

  @Get('verify/email')
  async verifyEmail() {
    return 'verify-email';
  }

  @Post('verify/email/resend')
  async resendVerifyEmail() {
    return 'resend-verify-email';
  }
}
