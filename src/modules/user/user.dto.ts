import {
  EmailValidators,
  StringValidators,
} from '@/decorators/properties.decorator';

export class UpdateUserDto {
  @StringValidators({ required: false })
  username?: string;

  @EmailValidators({ required: false })
  email?: string;

  @StringValidators({ required: false })
  bio?: string;
}
