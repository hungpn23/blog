import { Uuid } from '@/types/branded.type';
import { OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsUUID()
  topicId: Uuid;
}

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['topicId'] as const),
) {}
