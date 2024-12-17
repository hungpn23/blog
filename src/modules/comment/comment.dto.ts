import { StringDecorators } from '@/decorators/properties.decorator';

export class CreateCommentDto {
  @StringDecorators()
  content: string;
}

export class UpdateCommentDto extends CreateCommentDto {}
