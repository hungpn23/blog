import { PickType } from '@nestjs/swagger';
import { User } from './entities/user.entity';

export class UpdateUserDto extends PickType(User, ['bio', 'email']) {}
