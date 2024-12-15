import { type Uuid } from '@/types/branded.type';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class CreateCommentDto {
  content: string;

  @ApiProperty({ type: () => String })
  postId: Uuid;
}

export class UpdateCommentDto extends PickType(CreateCommentDto, [
  'content',
] as const) {}
