import { PartialType } from '@nestjs/swagger';

export class CreatePostDto {
  title: string;
  content: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}
