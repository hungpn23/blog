import { ApiError } from '@/constants';
import { AuthException } from '@/exceptions/auth.exception';
import { IErrorDetail } from '@/interfaces/error-detail.interface';
import { IError } from '@/interfaces/error.interface';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    let error: IError;

    if (exception instanceof UnprocessableEntityException) {
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

    return errorResponse as IError;
  }

  private handleAuthException(exception: AuthException) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: exception.getStatus(),
      message: exception.message,
    } as IError;
  }

  private handleHttpException(exception: HttpException) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: exception.getStatus(),
      message: exception.message,
    } as IError;
  }

  private handleQueryFailedError(error: QueryFailedError) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: error.message.includes('Duplicate entry') ? 409 : 400,
      message: error.message,
    } as IError;
  }

  private handleEntityNotFoundError(error: EntityNotFoundError) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.NOT_FOUND,
      message: ApiError.NotFound,
    } as IError;
  }

  private handleError(error: any) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error?.message || ApiError.Unknown,
    } as IError;
  }

  private getValidationErrorDetails(errors: ValidationError[]) {
    function extractErrors(error: ValidationError, parentProperty?: string) {
      const property = parentProperty
        ? `${parentProperty}.${error.property}`
        : error.property;

      const currentErrors: IErrorDetail[] = Object.entries(
        error.constraints || {},
      ).map(([code, message]) => ({
        property,
        code,
        message,
      }));

      const childErrors: IErrorDetail[] =
        error.children?.flatMap((childError) =>
          extractErrors(childError, property),
        ) || [];

      return [...currentErrors, ...childErrors] as IErrorDetail[];
    }

    return errors.flatMap((error) => extractErrors(error)) as IErrorDetail[];
  }
}
