import { IErrorDetail } from './error-detail.interface';

export class IError {
  timestamp: string;
  statusCode: number;
  message: string;
  details?: IErrorDetail[];
  stack?: string;
}
