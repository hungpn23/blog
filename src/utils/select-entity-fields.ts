import { AbstractEntity } from '@/database/entities/abstract.entity';

// TODO: for select entity fields
export function selectEntityFields<T extends AbstractEntity>(
  _fields: Array<keyof T>,
) {
  const abstractFields: Array<keyof AbstractEntity> = [];
  return abstractFields;
}
