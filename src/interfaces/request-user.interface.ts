import { JwtPayloadType } from '@/modules/auth/auth.type';
import { Request } from 'express';

export interface IRequestUser extends Request {
  user: JwtPayloadType;
}
