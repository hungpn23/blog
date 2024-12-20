import { IS_PUBLIC_KEY, IS_REFRESH_TOKEN_KEY } from '@/constants/index';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';
import { AuthService } from '../auth.service';
import { JwtPayloadType, JwtRefreshPayloadType } from '../auth.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (isPublic) return true;

    const isRefreshToken = this.reflector.getAllAndOverride<boolean>(
      IS_REFRESH_TOKEN_KEY,
      [context.getClass(), context.getHandler()],
    );
    if (isRefreshToken) {
      const request = context.switchToHttp().getRequest<ExpressRequest>();
      const refreshToken = this.extractTokenFromHeader(request);
      if (!refreshToken) throw new UnauthorizedException();

      request['user'] = this.authService.verifyRefreshToken(
        refreshToken,
      ) as JwtRefreshPayloadType;

      return true;
    }

    const request = context.switchToHttp().getRequest<ExpressRequest>();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) throw new UnauthorizedException();

    request['user'] = (await this.authService.verifyAccessToken(
      accessToken,
    )) as JwtPayloadType;

    return true;
  }

  private extractTokenFromHeader(request: ExpressRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
