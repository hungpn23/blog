import { type Uuid } from '@/types/branded.type';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  async findOne(userId: Uuid): Promise<User> {
    return await User.findOneOrFail({
      where: { id: userId },
      relations: { sessions: true },
    });
  }

  async uploadAvatar(userId: Uuid, filePath: string) {
    await User.update({ id: userId }, { avatar: filePath });
  }
}
