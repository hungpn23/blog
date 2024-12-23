import { Role } from '@/constants';
import { type Uuid } from '@/types/branded.type';

type BaseJwtPayload = {
  sessionId: Uuid;
  iat?: number;
  exp?: number;
};

export type JwtPayloadType = BaseJwtPayload & { userId: Uuid; role: Role };

export type JwtRefreshPayloadType = JwtPayloadType & { signature: string };
