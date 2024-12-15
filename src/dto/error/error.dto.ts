import { ApiHideProperty } from '@nestjs/swagger';
import { ErrorDetailDto } from './error-detail.dto';

export class ErrorDto {
  statusCode: number;
  message: string;
  timestamp: string;
  details?: ErrorDetailDto[];

  @ApiHideProperty()
  stack?: string;
}
