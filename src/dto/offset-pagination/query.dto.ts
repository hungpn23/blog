import { Order } from '@/constants';
import {
  EnumValidators,
  NumberValidators,
  StringValidators,
} from '@/decorators/properties.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class OffsetPaginationQueryDto {
  @NumberValidators({ isInt: true, min: 1, required: false })
  page?: number = 1;

  @NumberValidators({ isInt: true, min: 10, required: false })
  take?: number = 10;

  @EnumValidators(Order, { required: false })
  @ApiProperty({ type: () => Order, default: Order.DESC })
  order?: Order = Order.DESC; // ?? it is not a referenceable value

  @StringValidators({ required: false })
  search?: string;

  get skip() {
    return this.page ? (this.page - 1) * this.take : 0;
  }
}

export class PostQueryDto extends OffsetPaginationQueryDto {
  @StringValidators({ required: false })
  tag?: string;
}
