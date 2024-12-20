import { AuthEnvVariables } from '@/configs/auth.config';
import { AuthError, Role } from '@/constants/index';
import { AuthException } from '@/exceptions/auth.exception';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { Cache } from 'cache-manager';
import crypto from 'crypto';
import { DeleteResult } from 'typeorm';
import { SessionEntity } from '../user/entities/session.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthReqDto } from './auth.dto';
import { JwtPayloadType, JwtRefreshPayloadType } from './auth.type';

@Injectable()
export class AuthService {
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

    const newUser = await UserEntity.save(
      new UserEntity({ ...dto, role: Role.USER }),
    );

    return { userId: newUser.id, role: newUser.role };
  }

  async login(dto: AuthReqDto) {
    const { email, password } = dto;
    const user = await UserEntity.findOne({
      where: { email },
    });

    const isValid =
      user && (await this.verifyPassword(user.password, password));
    if (!isValid) throw new AuthException(AuthError.V02);

    const signature = this.createSignature();
    const session = new SessionEntity({ signature, user });

    const payload: JwtPayloadType = {
      userId: user.id,
      sessionId: session.id,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(payload),
      this.createRefreshToken({ ...payload, signature }),
    ]);

    const { exp } = this.verifyRefreshToken(refreshToken);
    await SessionEntity.save({ ...session, expiresAt: new Date(exp * 1000) }); // bc js Date accepts milliseconds

    return {
      userId: user.id,
      accessToken,
      refreshToken,
    };
  }

  async logout(payload: JwtPayloadType): Promise<DeleteResult> {
    const { sessionId, exp, userId } = payload;
    const cacheKey = `SESSION_BLACKLIST:${userId}:${sessionId}`;
    const data = true;
    const ttl = exp * 1000 - Date.now(); // remaining time in milliseconds
    await this.cacheManager.store.set<boolean>(cacheKey, data, ttl);

    return await SessionEntity.delete({ id: sessionId });
  }

  async refreshToken({ sessionId, signature }: JwtRefreshPayloadType) {
    const session = await SessionEntity.findOne({
      where: { id: sessionId },
      relations: { user: true },
      select: { id: true, signature: true, user: { id: true } },
    });

    if (!session || session.signature !== signature)
      throw new UnauthorizedException();

    const payload: JwtPayloadType = {
      userId: session.user.id,
      sessionId,
      role: session.user.role,
    };

    const accessToken = await this.createAccessToken(payload);

    return { accessToken };
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
      throw new UnauthorizedException(); // token expired or invalid
    }

    const cacheKey = `SESSION_BLACKLIST:${payload.userId}:${payload.sessionId}`;
    const isSessionBlacklisted = await this.cacheManager.store.get(cacheKey);

    if (isSessionBlacklisted) {
      await SessionEntity.delete({ user: { id: payload.userId } }); // delete all user's sessions
      throw new AuthException(AuthError.E03);
    }

    return payload;
  }

  verifyRefreshToken(refreshToken: string): JwtRefreshPayloadType {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.configService.get('AUTH_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException(); // token expired or invalid
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
