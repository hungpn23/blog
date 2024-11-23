import { IS_PUBLIC, IS_REFRESH_TOKEN, ValidationError } from '@/constants';
import { ValidationException } from '@/exceptions/validation.exception';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isPublic) return true;

    const isRefreshToken = this.reflector.getAllAndOverride<boolean>(
      IS_REFRESH_TOKEN,
      [context.getClass(), context.getHandler()],
    );

    if (isRefreshToken) {
      const request = context.switchToHttp().getRequest<ExpressRequest>();
      const refreshToken = this.extractTokenFromHeader(request);

      if (!refreshToken)
        throw new ValidationException(
          ValidationError.TokenNotFound,
          HttpStatus.NOT_FOUND,
        );

      request['user'] = this.authService.verifyRefreshToken(refreshToken);

      return true;
    }

    const request = context.switchToHttp().getRequest<ExpressRequest>();
    const accessToken = this.extractTokenFromHeader(request);

    if (!accessToken)
      throw new ValidationException(
        ValidationError.TokenNotFound,
        HttpStatus.NOT_FOUND,
      );

    request['user'] = await this.authService.verifyAccessToken(accessToken);

    return true;
  }

  private extractTokenFromHeader(request: ExpressRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
