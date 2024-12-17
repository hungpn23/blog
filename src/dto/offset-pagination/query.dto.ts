import { Order } from '@/constants';
import {
  EnumDecorators,
  NumberDecorators,
  StringDecorators,
} from '@/decorators/properties.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class OffsetPaginationQueryDto {
  @NumberDecorators({ isInt: true, min: 1, required: false })
  page?: number = 1;

  @NumberDecorators({ isInt: true, min: 10, required: false })
  limit?: number = 10;

  @EnumDecorators(Order, { required: false })
  @ApiProperty({ type: () => Order, default: Order.ASC })
  order?: Order;

  @StringDecorators({ required: false })
  search?: string;

  get offset() {
    return this.page ? (this.page - 1) * this.limit : 0;
  }
}
