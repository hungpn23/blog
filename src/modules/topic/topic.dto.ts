import { StringDecorators } from '@/decorators/properties.decorator';

export class CreateTopicDto {
  @StringDecorators()
  name: string;
}

export class UpdateTopicDto extends CreateTopicDto {}
