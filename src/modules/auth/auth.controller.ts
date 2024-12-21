import { RefreshToken } from '@/decorators/auth/refresh-token.decorator';
import { ApiEndpoint } from '@/decorators/endpoint.decorator';
import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import {
  AuthReqDto,
  LoginResDto,
  RefreshResDto,
  RegisterResDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { JwtPayloadType, JwtRefreshPayloadType } from './auth.type';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiEndpoint({
    isPublic: true,
    summary: 'register a new account',
    type: RegisterResDto,
  })
  @Post('/register')
  async register(@Body() dto: AuthReqDto): Promise<RegisterResDto> {
    return await this.authService.register(dto);
  }

  @ApiEndpoint({
    isPublic: true,
    summary: 'login',
    type: LoginResDto,
  })
  @Post('/login')
  async login(@Body() dto: AuthReqDto): Promise<LoginResDto> {
    return await this.authService.login(dto);
  }

  @ApiEndpoint({ summary: 'logout', type: DeleteResult })
  @Post('/logout')
  async logout(@JwtPayload() payload: JwtPayloadType) {
    return await this.authService.logout(payload);
  }

  @RefreshToken()
  @ApiEndpoint({ type: RefreshResDto, summary: 'get new access token' })
  @Post('/refresh')
  async refreshToken(
    @JwtPayload() payload: JwtRefreshPayloadType,
  ): Promise<RefreshResDto> {
    return await this.authService.refreshToken(payload);
  }

  // TODO auth api

  @ApiExcludeEndpoint()
  @Post('forgot-password')
  async forgotPassword() {
    return 'forgot-password';
  }

  @ApiExcludeEndpoint()
  @Post('verify/forgot-password')
  async verifyForgotPassword() {
    return 'verify-forgot-password';
  }

  @ApiExcludeEndpoint()
  @Get('verify/email')
  async verifyEmail() {
    return 'verify-email';
  }

  @ApiExcludeEndpoint()
  @Post('verify/email/resend')
  async resendVerifyEmail() {
    return 'resend-verify-email';
  }
}
