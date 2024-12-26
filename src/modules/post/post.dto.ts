import { StringValidators } from '@/decorators/properties.decorator';
import { PartialType } from '@nestjs/swagger';

export class CreatePostDto {
  @StringValidators()
  title: string;

  @StringValidators()
  content: string;

  @StringValidators({ isArray: true })
  tags: string[];
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}
