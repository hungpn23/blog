export const SYSTEM = 'system';
export const IS_PUBLIC_KEY = 'isPublic';
export const IS_REFRESH_TOKEN_KEY = 'isRefreshToken';

// TODO: authorization
export enum Role {
  User = 'user',
  Admin = 'admin',
}

export enum ProductStatus {
  Available = 'available',
  Unavailable = 'unavailable',
}

export enum AuthError {
  // Validation
  V01 = 'user.validation.is_empty',
  V02 = 'user.validation.is_invalid',
  V03 = 'user.validation.email_exists',

  // Error
  E01 = 'user.error.email_exists',
  E02 = 'user.error.not_found',
  E03 = 'user.error.blacklist_detected',
}

export enum ApiError {
  Unknown = 'unknown error',
  Exist = 'exist error',
  NotFound = 'not found error',
}

export const DEFAULT_PAGE_LIMIT = 10;
