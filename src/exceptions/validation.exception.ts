import { ValidationError } from '@/constants/index';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(
    error: string = ValidationError.Unknown,
    status: number = HttpStatus.BAD_REQUEST,
  ) {
    super(error, status);
  }
}
