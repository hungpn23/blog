import { type Uuid } from '@/types/branded.type';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class CreatePostDto {
  title: string;
  content: string;

  @ApiProperty({ type: () => String })
  topicId: Uuid;
}

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['topicId'] as const),
) {}
