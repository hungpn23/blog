import { type Uuid } from '@/types/branded.type';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './user.dto';

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

  async update(userId: Uuid, dto: UpdateUserDto) {
    const found = await User.findOneOrFail({ where: { id: userId } });

    return await User.save(
      Object.assign(found, { ...dto, updatedBy: found.username } as User),
    );
  }
}
