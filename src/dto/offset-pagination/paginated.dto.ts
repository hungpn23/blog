import { AbstractEntity } from '@/database/entities/abstract.entity';
import { ApiExtraModels } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OffsetMetadataDto } from './metadata.dto';

@Expose()
@ApiExtraModels(() => OffsetPaginatedDto)
export class OffsetPaginatedDto<Data extends AbstractEntity> {
  data: Data[];
  metadata: OffsetMetadataDto;

  constructor(data: Data[], metadata: OffsetMetadataDto) {
    this.data = data;
    this.metadata = metadata;
  }
}
