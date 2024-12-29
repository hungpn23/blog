import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OffsetMetadataDto } from './metadata.dto';

@Expose()
export class OffsetPaginatedDto<Data> {
  @ApiProperty({ type: () => [Object] }) // to avoid circular dependency
  paginatedData: Data[];

  metadata: OffsetMetadataDto;

  constructor(paginatedData: Data[], metadata: OffsetMetadataDto) {
    this.paginatedData = paginatedData;
    this.metadata = metadata;
  }
}
