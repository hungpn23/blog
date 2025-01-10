import { IS_PUBLIC_KEY, IS_REFRESH_TOKEN_KEY } from '@/constants/index';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.getMetadata<boolean>(IS_PUBLIC_KEY, context);
    if (isPublic) return true;

    const isRefreshToken = this.getMetadata<boolean>(
      IS_REFRESH_TOKEN_KEY,
      context,
    );

    const request = context.switchToHttp().getRequest<ExpressRequest>();

    if (isRefreshToken) {
      const refreshToken = this.extractTokenFromHeader(request);
      request['user'] = this.authService.verifyRefreshToken(refreshToken);

      return true;
    }

    const accessToken = this.extractTokenFromHeader(request);
    request['user'] = await this.authService.verifyAccessToken(accessToken);

    return true;
  }

  private extractTokenFromHeader(request: ExpressRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : '';
  }

  private getMetadata<TValue>(metadataKey: any, context: ExecutionContext) {
    return this.reflector.getAllAndOverride<TValue>(metadataKey, [
      context.getClass(),
      context.getHandler(),
    ]);
  }
}
