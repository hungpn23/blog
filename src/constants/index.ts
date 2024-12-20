export const SYSTEM = 'system';
export const IS_PUBLIC_KEY = 'isPublic';
export const IS_REFRESH_TOKEN_KEY = 'isRefreshToken';
export const ROLE_KEY = 'role';

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

// TODO: authorization
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
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
  Unknown = 'api.error.unknown',
  Exist = 'api.error.entity_exist',
  NotFound = 'api.error.entity_not_found',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const DEFAULT_CURRENT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 10;
