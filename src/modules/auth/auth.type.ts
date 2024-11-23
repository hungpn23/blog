import { Uuid } from '@/types';

type BaseJwtPayload = {
  sessionId: Uuid;
  iat: number;
  exp: number;
};

export type JwtPayloadType = BaseJwtPayload & { userId: Uuid };

export type JwtRefreshPayloadType = BaseJwtPayload & { signature: string };
