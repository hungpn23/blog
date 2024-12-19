import { StringValidators } from '@/decorators/properties.decorator';

export class CreateTopicDto {
  @StringValidators()
  name: string;
}

export class UpdateTopicDto extends CreateTopicDto {}
