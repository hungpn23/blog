import { ApiError } from '@/constants';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    error: string = ApiError.Unknown,
    status: number = HttpStatus.BAD_REQUEST,
  ) {
    super(error, status);
  }
}
