import { AuthException } from '@/exceptions/validation.exception';
import { IErrorDetail } from '@/interfaces/error-detail.interface';
import { IError } from '@/interfaces/error.interface';
import { ExceptionResponse } from '@/interfaces/exception-response.interface';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
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
      this.handleAuthException(exception);
    } else if (exception instanceof HttpException) {
      this.handleHttpException(exception);
    } else if (exception instanceof QueryFailedError) {
      this.handleQueryFailedError(exception);
    } else if (exception instanceof EntityNotFoundError) {
      this.handleEntityNotFoundError(exception);
    } else {
      this.handleError(exception);
    }

    response.status(error.statusCode).json(error);
  }

  private handleUnprocessableEntityException(
    exception: UnprocessableEntityException,
  ) {
    const response = exception.getResponse() as ExceptionResponse;
    const statusCode = exception.getStatus();

    const errorResponse: IError = {
      timestamp: new Date().toISOString(),
      statusCode,
      message: 'Validation failed',
      details: this.getValidationErrorDetails(
        response.message as ValidationError[],
      ),
    };

    return errorResponse;
  }

  private handleAuthException(exception: AuthException) {
    const response = exception.getResponse() as ExceptionResponse;
    const statusCode = exception.getStatus();

    const errorResponse: IError = {
      timestamp: new Date().toISOString(),
      statusCode,
      message: response.message as string,
    };

    return errorResponse;
  }

  private handleHttpException(exception: HttpException) {
    return {
      timestamp: new Date().toISOString(),
      statusCode: exception.getStatus(),
      message: exception.message,
    } as IError;
  }

  private handleQueryFailedError(exception: QueryFailedError) {
    console.log(exception);
  }

  private handleEntityNotFoundError(exception: EntityNotFoundError) {
    console.log(exception);
  }

  private handleError(exception: any) {
    console.log(exception);
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
