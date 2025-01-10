import { IS_PUBLIC_KEY } from '@/constants';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let reflector: Partial<Record<keyof Reflector, jest.Mock>>;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;
  let context: Partial<Record<keyof ExecutionContext, jest.Mock>>;
  let module: TestingModule;

  beforeEach(async () => {
    authService = {
      verifyAccessToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
    };

    reflector = {
      getAllAndOverride: jest.fn(),
    };

    context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn(),
      }),
    };

    module = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: Reflector,
          useValue: reflector,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    module.close();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if the route is public', async () => {
      const isPublic = true;
      reflector.getAllAndOverride.mockReturnValue(isPublic);

      const result = await guard.canActivate(context as ExecutionContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(1);
      expect(context.switchToHttp().getRequest).not.toHaveBeenCalled();
      expect(authService.verifyAccessToken).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return true if the route is not public and a valid access token is provided', async () => {
      const isPublic = false;
      reflector.getAllAndOverride.mockReturnValue(isPublic);

      context.switchToHttp().getRequest.mockReturnValue({
        headers: {
          authorization: `Bearer valid-access-token`,
        },
      });

      authService.verifyAccessToken.mockResolvedValueOnce({ userId: 'x' });

      const result = await guard.canActivate(context as ExecutionContext);

      expect(reflector.getAllAndOverride).toHaveBeenCalledTimes(2);
      expect(context.switchToHttp().getRequest).toHaveBeenCalledTimes(1);
      expect(authService.verifyAccessToken).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });
  });
});
