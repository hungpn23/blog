import { Uuid } from '@/types/branded.type';
import { PickType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsUUID()
  postId: Uuid;
}

export class UpdateCommentDto extends PickType(CreateCommentDto, [
  'content',
] as const) {}
