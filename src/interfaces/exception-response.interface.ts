import { ValidationError } from '@nestjs/common';

export interface ExceptionResponse {
  message: string | ValidationError[];
  error: string;
  statusCode: number;
}
