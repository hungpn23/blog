import { AbstractEntity } from '@/database/entities/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OffsetMetadataDto } from './metadata.dto';

@Expose()
export class OffsetPaginatedDto<Data extends AbstractEntity> {
  @ApiProperty({ type: () => [Object] }) // to avoid circular dependency
  data: Data[];

  metadata: OffsetMetadataDto;

  constructor(data: Data[], metadata: OffsetMetadataDto) {
    this.data = data;
    this.metadata = metadata;
  }
}
