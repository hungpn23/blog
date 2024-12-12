import { ApiProperty } from '@nestjs/swagger';

export class ErrorDetailDto {
  @ApiProperty()
  property: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  message: string;
}
