import { ApiExtraModels } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OffsetPaginationQueryDto } from './query.dto';

@Expose()
@ApiExtraModels(() => OffsetMetadataDto)
export class OffsetMetadataDto {
  limit: number;
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  nextPage: number;
  previousPage: number;

  constructor(totalRecords: number, query: OffsetPaginationQueryDto) {
    this.limit = +query.limit;

    this.totalRecords = totalRecords;

    this.totalPages =
      this.limit > 0 ? Math.ceil(totalRecords / query.limit) : 0;

    this.currentPage = +query.page;

    this.nextPage =
      this.currentPage < this.totalPages ? this.currentPage + 1 : undefined;

    this.previousPage =
      this.currentPage > 1 && this.currentPage - 1 < this.totalPages
        ? this.currentPage - 1
        : undefined;
  }
}
