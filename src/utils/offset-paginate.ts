import { AbstractEntity } from '@/database/entities/abstract.entity';
import { OffsetMetadataDto } from '@/dto/offset-pagination/metadata.dto';
import { OffsetPaginationQueryDto } from '@/dto/offset-pagination/query.dto';
import { SelectQueryBuilder } from 'typeorm';

export default async function paginate<Entity extends AbstractEntity>(
  builder: SelectQueryBuilder<Entity>,
  query: OffsetPaginationQueryDto,
) {
  const { offset, limit, order } = query;

  builder.skip(offset).take(limit).orderBy(`${builder.alias}.createdAt`, order);

  const sql = builder.getSql();
  console.log('🚀 ~ sql:', sql);
  const [entities, totalRecords] = await builder.getManyAndCount();

  const metadata = new OffsetMetadataDto(totalRecords, query);

  return { entities, metadata };
}
