import { ValidationError } from '@/constants/index';
import { ValidationException } from '@/exceptions/validation.exception';
import { Uuid } from '@/types/branded.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
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
    if (found)
      throw new ValidationException(
        ValidationError.EmailExists,
        HttpStatus.CONFLICT,
      );

    const newUser = await User.save(new User(dto));

    return { userId: newUser.id };
  }

  async login(dto: AuthReqDto) {
    const { email, password } = dto;
    const user = await User.findOne({
      where: { email },
    });
    console.log('🚀 ~ AuthService ~ login ~ user:', user);

    const isValid =
      user && (await this.verifyPassword(user.password, password));
    if (!isValid)
      throw new ValidationException(
        ValidationError.InvalidCredentials,
        HttpStatus.UNAUTHORIZED,
      );

    const signature = this.createSignature();
    const session = new Session({
      signature,
      userId: user.id,
    });
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
    const cacheKey = `SESSION_BLACKLIST:${payload.sessionId}`;
    const data = true;
    const ttl = payload.exp * 1000 - Date.now();
    await this.cacheManager.store.set<boolean>(cacheKey, data, ttl);

    await Session.delete({ id: payload.sessionId });
  }

  async refreshToken(payload: JwtRefreshPayloadType) {
    const { sessionId, signature } = payload;
    const session = await Session.findOneByOrFail({ id: sessionId });

    if (session.signature !== signature)
      throw new ValidationException(
        ValidationError.SessionError,
        HttpStatus.UNAUTHORIZED,
      );

    const accessToken = await this.createAccessToken({
      userId: session.userId,
      sessionId,
    });

    return { accessToken };
  }
  // *** END ROUTE ***

  // *** START GUARD ***
  async verifyAccessToken(accessToken: string): Promise<JwtPayloadType> {
    let payload: JwtPayloadType;
    try {
      payload = this.jwtService.verify(accessToken, {
        secret: this.configService.getOrThrow<string>('auth.secret'),
      });
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new ValidationException(
          ValidationError.TokenExpired,
          HttpStatus.UNAUTHORIZED,
        );

      throw new ValidationException(
        ValidationError.VerifyAccessToken,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // TODO: Force logout if the session is in the blacklist !
    const cacheKey = `SESSION_BLACKLIST:${payload.sessionId}`;
    const isSessionBlacklisted =
      await this.cacheManager.store.get<boolean>(cacheKey);
    if (isSessionBlacklisted)
      throw new ValidationException(
        ValidationError.SessionBlacklisted,
        HttpStatus.FORBIDDEN,
      );

    return payload;
  }

  verifyRefreshToken(refreshToken: string): JwtRefreshPayloadType {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow<string>('auth.refreshSecret'),
      });
    } catch (error) {
      // TODO: logout user
      throw new ValidationException(
        ValidationError.VerifyRefreshToken,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  // *** END GUARD ***

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
