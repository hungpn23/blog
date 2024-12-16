import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { ErrorDetailDto } from './error-detail.dto';

export class ErrorDto {
  statusCode: number;
  message: string;
  timestamp: string;
  details?: ErrorDetailDto[];

  @ApiHideProperty()
  stack?: string;
}

export class CommonErrorDto extends OmitType(ErrorDto, ['details']) {}
