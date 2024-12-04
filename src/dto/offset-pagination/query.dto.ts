import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_LIMIT, Order } from '@/constants';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class OffsetPaginationQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: number = DEFAULT_CURRENT_PAGE;

  @IsOptional()
  @IsNumberString()
  limit?: number = DEFAULT_PAGE_LIMIT;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Order)
  order?: Order = Order.ASC;

  get offset() {
    return this.page ? (this.page - 1) * this.limit : 0;
  }
}
