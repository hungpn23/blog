import { Uuid } from '@/types/branded.type';
import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  findOne(userId: Uuid): Observable<User> {
    // observable test
    return from(
      User.findOneOrFail({
        where: { id: userId },
        relations: { sessions: true },
      }),
    );
  }

  async uploadAvatar(userId: Uuid, filePath: string) {
    await User.update({ id: userId }, { avatar: filePath });
  }
}
