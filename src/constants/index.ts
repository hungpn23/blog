export const SYSTEM = 'system';
export const IS_PUBLIC = 'isPublic';
export const IS_REFRESH_TOKEN = 'isRefreshToken';

// TODO: authorization
export enum Role {
  User = 'user',
  Admin = 'admin',
}

export enum ProductStatus {
  Available = 'available',
  Unavailable = 'unavailable',
}

export enum ValidationError {
  Unknown = 'unknown validation error',
  EmailExists = 'email already exists',
  InvalidCredentials = 'invalid credentials',
  TokenExpired = 'token expired',
  SessionBlacklisted = 'session blacklisted, access denied',
  VerifyRefreshToken = 'verify refresh token error',
  VerifyAccessToken = 'verify access token error',
  TokenNotFound = 'token not found',
  SessionError = 'invalid session',
}

export enum ApiError {
  Unknown = 'unknown error',
  Exist = 'exist error',
  NotFound = 'not found error',
}

export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_CURRENT_PAGE = 1;
