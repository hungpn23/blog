import { AuthEnvVariables } from '@/configs/auth.config';
import { AuthError, Role } from '@/constants/index';
import { AuthException } from '@/exceptions/auth.exception';
import { JwtPayloadType, JwtRefreshPayloadType } from '@/types/auth.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import argon2 from 'argon2';
import { Cache } from 'cache-manager';
import crypto from 'crypto';
import { Response as ExpressResponse } from 'express';
import ms from 'ms';
import { DeleteResult } from 'typeorm';
import { SessionEntity } from '../user/entities/session.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthReqDto } from './auth.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private configService: ConfigService<AuthEnvVariables>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // *** START ROUTE ***
  async register(dto: AuthReqDto) {
    const { email } = dto;
    const found = await UserEntity.existsBy({ email });
    if (found) throw new AuthException(AuthError.E01);

    await UserEntity.save(new UserEntity({ ...dto, role: Role.USER }));
  }

  async login(dto: AuthReqDto, res: ExpressResponse): Promise<void> {
    const { email, password } = dto;
    const user = await UserEntity.findOne({
      where: { email },
    });

    const isValid =
      user && (await this.verifyPassword(user.password, password));
    if (!isValid) throw new AuthException(AuthError.V02);

    const accessTokenTtl = this.configService.get('AUTH_JWT_TOKEN_EXPIRES_IN', {
      infer: true,
    });

    const refreshTokenTtl = this.configService.get(
      'AUTH_REFRESH_TOKEN_EXPIRES_IN',
      { infer: true },
    );

    const signature = this.createSignature();
    const session = await SessionEntity.save(
      new SessionEntity({
        signature,
        user,
        expiresAt: new Date(Date.now() + ms(refreshTokenTtl)),
      }),
    );

    const payload: JwtPayloadType = {
      userId: user.id,
      sessionId: session.id,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(payload),
      this.createRefreshToken({ ...payload, signature }),
    ]);

    res.cookie('access_token', accessToken, { maxAge: ms(accessTokenTtl) });
    res.cookie('refresh_token', refreshToken, { maxAge: ms(refreshTokenTtl) });
  }

  async logout(payload: JwtPayloadType): Promise<DeleteResult> {
    const { sessionId, exp, userId } = payload;
    const key = `SESSION_BLACKLIST:${userId}:${sessionId}`;
    const ttl = exp * 1000 - Date.now(); // remaining time in milliseconds
    await this.cacheManager.store.set(key, true, ttl);

    return await SessionEntity.delete({ id: sessionId });
  }

  async refreshToken(
    { sessionId, signature }: JwtRefreshPayloadType,
    res: ExpressResponse,
  ): Promise<void> {
    const session = await SessionEntity.findOne({
      where: { id: sessionId },
      relations: { user: true },
    });

    if (!session || session.signature !== signature)
      throw new UnauthorizedException();

    const payload: JwtPayloadType = {
      userId: session.user.id,
      sessionId,
      role: session.user.role,
    };

    const accessToken = await this.createAccessToken(payload);

    const accessTokenTtl = this.configService.get('AUTH_JWT_TOKEN_EXPIRES_IN', {
      infer: true,
    });

    res.cookie('access_token', accessToken, { maxAge: ms(accessTokenTtl) });
  }
  // *** END ROUTE ***

  // ======================================================= //

  // *** START GUARD ***
  async verifyAccessToken(accessToken: string): Promise<JwtPayloadType> {
    let payload: JwtPayloadType;
    try {
      payload = this.jwtService.verify(accessToken, {
        secret: this.configService.get('AUTH_JWT_SECRET'),
      });
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException(AuthError.V04);
      throw new UnauthorizedException(AuthError.V05);
    }

    const key = `SESSION_BLACKLIST:${payload.userId}:${payload.sessionId}`;
    const isSessionBlacklisted =
      await this.cacheManager.store.get<boolean>(key);

    if (isSessionBlacklisted) {
      await SessionEntity.delete({ user: { id: payload.userId } }); // delete all user's sessions
      throw new AuthException(AuthError.E03);
    }

    return payload;
  }

  async verifyRefreshToken(
    refreshToken: string,
  ): Promise<JwtRefreshPayloadType> {
    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('AUTH_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException(AuthError.V05);
    }
  }
  // *** END GUARD ***

  // ======================================================= //

  // *** START PRIVATE ***
  private async createAccessToken(payload: JwtPayloadType): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('AUTH_JWT_SECRET'),
      expiresIn: this.configService.get('AUTH_JWT_TOKEN_EXPIRES_IN'),
    });
  }

  private async createRefreshToken(
    payload: JwtRefreshPayloadType,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('AUTH_REFRESH_SECRET'),
      expiresIn: this.configService.get('AUTH_REFRESH_TOKEN_EXPIRES_IN'),
    });
  }

  private async verifyPassword(
    hashed: string,
    plain: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashed, plain);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private createSignature() {
    return crypto.randomBytes(16).toString('hex');
  }
  // *** END PRIVATE ***
}
