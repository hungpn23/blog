import { ApiError } from '@/constants';
import { ErrorDetailDto } from '@/dto/error/error-detail.dto';
import { ErrorDto } from '@/dto/error/error.dto';
import { AuthException } from '@/exceptions/auth.exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    let error: ErrorDto;

    this.logger.debug('exception::::::', exception);

    if (exception instanceof UnprocessableEntityException) {
      // this exception is thrown from main.ts (ValidationPipe)
      error = this.handleUnprocessableEntityException(exception);
    } else if (exception instanceof AuthException) {
      error = this.handleAuthException(exception);
    } else if (exception instanceof HttpException) {
      error = this.handleHttpException(exception);
    } else if (exception instanceof QueryFailedError) {
      error = this.handleQueryFailedError(exception);
    } else if (exception instanceof EntityNotFoundError) {
      error = this.handleEntityNotFoundError(exception);
    } else {
      error = this.handleError(exception);
    }

    response.status(error.statusCode).json(error);
  }

  private handleUnprocessableEntityException(
    exception: UnprocessableEntityException,
  ) {
    const response = exception.getResponse() as { message: ValidationError[] };
    const statusCode = exception.getStatus();

    const errorResponse = {
      timestamp: new Date().toISOString(),
      statusCode,
      message: 'Validation failed',
      details: this.getValidationErrorDetails(response.message),
    };

    return errorResponse as ErrorDto;
  }

  private handleAuthException(exception: AuthException) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: exception.getStatus(),
      message: exception.message,
    } as ErrorDto;
  }

  private handleHttpException(exception: HttpException) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: exception.getStatus(),
      message: exception.message,
    } as ErrorDto;
  }

  private handleQueryFailedError(error: QueryFailedError) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: error.message.includes('Duplicate entry') ? 409 : 400,
      message: error.message,
    } as ErrorDto;
  }

  private handleEntityNotFoundError(error: EntityNotFoundError) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.NOT_FOUND,
      message: ApiError.NotFound,
    } as ErrorDto;
  }

  private handleError(error: any) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error?.message || ApiError.Unknown,
    } as ErrorDto;
  }

  private getValidationErrorDetails(errors: ValidationError[]) {
    function extractErrors(error: ValidationError, parentProperty?: string) {
      const property = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      const currentErrors: ErrorDetailDto[] = Object.entries(
        error.constraints || {},
      ).map(([code, message]) => ({
        property,
        code,
        message,
      }));

      const childErrors: ErrorDetailDto[] =
        error.children?.flatMap((childError) =>
          extractErrors(childError, property),
        ) || [];

      return [...currentErrors, ...childErrors] as ErrorDetailDto[];
    }

    return errors.flatMap((error) => extractErrors(error)) as ErrorDetailDto[];
  }
}
