import { StringValidators } from '@/decorators/properties.decorator';

export class CreateCommentDto {
  @StringValidators()
  content: string;
}

export class UpdateCommentDto extends CreateCommentDto {}
