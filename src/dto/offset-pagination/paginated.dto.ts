import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Expose } from 'class-transformer';
import { OffsetMetadataDto } from './metadata.dto';

@Expose()
export class OffsetPaginatedDto<Data extends AbstractEntity> {
  data: Data[];
  metadata: OffsetMetadataDto;

  constructor(data: Data[], metadata: OffsetMetadataDto) {
    this.data = data;
    this.metadata = metadata;
  }
}
