import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_LIMIT, Order } from '@/constants';
import { ApiProperty } from '@nestjs/swagger';

export class OffsetPaginationQueryDto {
  @ApiProperty({ default: DEFAULT_CURRENT_PAGE })
  page?: number;

  @ApiProperty({ default: DEFAULT_PAGE_LIMIT })
  limit?: number;

  @ApiProperty({ enum: () => Order, default: Order.ASC })
  order?: Order;

  search?: string;

  get offset() {
    return this.page ? (this.page - 1) * this.limit : 0;
  }
}
