import { OmitType } from '@nestjs/swagger';
import { ErrorDetailDto } from './error-detail.dto';

export class ErrorDto {
  statusCode: number;
  message: string;
  timestamp: string;
  details?: ErrorDetailDto[];
}

export class CommonErrorDto extends OmitType(ErrorDto, ['details']) {}
