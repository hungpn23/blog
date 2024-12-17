import { Expose } from 'class-transformer';
import { OffsetPaginationQueryDto } from './query.dto';

@Expose()
export class OffsetMetadataDto {
  limit: number;
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;

  constructor(
    totalRecords: number,
    // !! temp solution for double init class instance
    query: OffsetPaginationQueryDto = new OffsetPaginationQueryDto(),
  ) {
    console.log('🚀 ~ OffsetMetadataDto ~ query:', query);
    this.limit = query.limit;

    this.totalRecords = totalRecords;

    this.totalPages = this.limit > 0 ? Math.ceil(totalRecords / this.limit) : 0;

    this.currentPage = query.page;

    this.nextPage =
      this.currentPage < this.totalPages ? this.currentPage + 1 : undefined;

    this.previousPage =
      this.currentPage > 1 && this.currentPage - 1 < this.totalPages
        ? this.currentPage - 1
        : undefined;
  }
}
