import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

export const JwtPayload = createParamDecorator(
  (_data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<ExpressRequest>();
    return request['user']; // request['user'] is set in the AuthGuard
  },
);
