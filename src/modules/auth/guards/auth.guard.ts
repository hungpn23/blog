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
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    const isPublic = this.getMetadata<boolean>(context, IS_PUBLIC_KEY);
    if (isPublic) return true;

    const isRefreshToken = this.getMetadata<boolean>(
      context,
      IS_REFRESH_TOKEN_KEY,
    );

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

  private getMetadata<TValue>(context: ExecutionContext, metadataKey: any) {
    return this.reflector.getAllAndOverride<TValue>(metadataKey, [
      context.getClass(),
      context.getHandler(),
    ]);
  }
}
