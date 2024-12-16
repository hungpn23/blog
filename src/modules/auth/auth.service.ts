import { AuthError } from '@/constants/index';
import { AuthException } from '@/exceptions/auth.exception';
import { type Uuid } from '@/types/branded.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import { Cache } from 'cache-manager';
import crypto from 'crypto';
import { Session } from '../user/entities/session.entity';
import { User } from '../user/entities/user.entity';
import { AuthReqDto } from './auth.dto';
import { JwtPayloadType, JwtRefreshPayloadType } from './auth.type';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // *** START ROUTE ***
  async register(dto: AuthReqDto) {
    const { email } = dto;
    const found = await User.existsBy({ email });
    if (found) throw new AuthException(AuthError.E01);

    const newUser = await User.save(new User(dto));

    return { userId: newUser.id };
  }

  async login(dto: AuthReqDto) {
    const { email, password } = dto;
    const user = await User.findOne({
      where: { email },
    });

    const isValid =
      user && (await this.verifyPassword(user.password, password));
    if (!isValid) throw new AuthException(AuthError.V02);

    const signature = this.createSignature();
    const session = new Session({ signature });
    await Session.save(session);

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken({ userId: user.id, sessionId: session.id }),
      this.createRefreshToken({ sessionId: session.id, signature }),
    ]);

    return {
      userId: user.id,
      accessToken,
      refreshToken,
    };
  }

  async logout(payload: JwtPayloadType): Promise<void> {
    const { sessionId, exp, userId } = payload;
    const cacheKey = `SESSION_BLACKLIST:${userId}:${sessionId}`;
    const data = true;
    const ttl = exp * 1000 - Date.now();
    await this.cacheManager.store.set<boolean>(cacheKey, data, ttl);

    await Session.delete({ id: sessionId });
  }

  async refreshToken(payload: JwtRefreshPayloadType) {
    const { sessionId, signature } = payload;
    const session = await Session.findOneBy({ id: sessionId });

    if (!session || session.signature !== signature)
      throw new UnauthorizedException();

    const accessToken = await this.createAccessToken({
      userId: session.user.id,
      sessionId,
    });

    return { accessToken };
  }
  // *** END ROUTE ***

  // ======================================================= //

  // *** START GUARD ***
  async verifyAccessToken(accessToken: string): Promise<JwtPayloadType> {
    let payload: JwtPayloadType;
    try {
      payload = this.jwtService.verify(accessToken, {
        secret: this.configService.getOrThrow<string>('auth.secret'),
      });
    } catch (error) {
      throw new UnauthorizedException();
    }

    const cacheKey = `SESSION_BLACKLIST:${payload.userId}:${payload.sessionId}`;
    const isSessionBlacklisted =
      await this.cacheManager.store.get<boolean>(cacheKey);
    // TODO: Force logout if the session is in the blacklist !
    if (isSessionBlacklisted) throw new AuthException(AuthError.E03);

    return payload;
  }

  verifyRefreshToken(refreshToken: string): JwtRefreshPayloadType {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow<string>('auth.refreshSecret'),
      });
    } catch (error) {
      // TODO: force logout user
      throw new UnauthorizedException();
    }
  }
  // *** END GUARD ***

  // ======================================================= //

  // *** START PRIVATE ***
  private async createAccessToken(data: {
    userId: Uuid;
    sessionId: Uuid;
  }): Promise<string> {
    return await this.jwtService.signAsync(
      { userId: data.userId, sessionId: data.sessionId },
      {
        secret: this.configService.getOrThrow<string>('auth.secret'),
        expiresIn: this.configService.getOrThrow<string>('auth.expiresIn'),
      },
    );
  }

  private async createRefreshToken(data: {
    sessionId: Uuid;
    signature: string;
  }): Promise<string> {
    return await this.jwtService.signAsync(
      { sessionId: data.sessionId, signature: data.signature },
      {
        secret: this.configService.getOrThrow<string>('auth.refreshSecret'),
        expiresIn: this.configService.getOrThrow<string>(
          'auth.refreshExpiresIn',
        ),
      },
    );
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
