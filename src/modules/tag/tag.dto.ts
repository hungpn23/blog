import { StringValidators } from '@/decorators/properties.decorator';

export class CreateTagDto {
  @StringValidators()
  name: string;
}

export class UpdateTagDto extends CreateTagDto {}
