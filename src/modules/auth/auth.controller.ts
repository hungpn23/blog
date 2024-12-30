import { RefreshToken } from '@/decorators/auth/refresh-token.decorator';
import { ApiEndpoint } from '@/decorators/endpoint.decorator';
import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { JwtPayloadType, JwtRefreshPayloadType } from '@/types/auth.type';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response as ExpressResponse } from 'express';
import { DeleteResult } from 'typeorm';
import { AuthReqDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiEndpoint({
    isPublic: true,
    summary: 'register a new account',
  })
  @Post('/register')
  async register(@Body() dto: AuthReqDto): Promise<void> {
    await this.authService.register(dto);
  }

  @ApiEndpoint({
    isPublic: true,
    summary: 'login',
  })
  @Post('/login')
  async login(
    @Body() dto: AuthReqDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<void> {
    return await this.authService.login(dto, res);
  }

  @ApiEndpoint({ summary: 'logout', type: DeleteResult })
  @Post('/logout')
  async logout(@JwtPayload() payload: JwtPayloadType) {
    return await this.authService.logout(payload);
  }

  @RefreshToken()
  @ApiEndpoint({ summary: 'get new access token' })
  @Post('/refresh-token')
  async refreshToken(
    @JwtPayload() payload: JwtRefreshPayloadType,
    // passthrough: true to not block automatic handle response by nestjs
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<void> {
    return await this.authService.refreshToken(payload, res);
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
