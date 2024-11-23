import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../auth/auth.type';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  async getUser(payload: JwtPayloadType) {
    return await User.findOne({
      where: { id: payload.userId },
      relations: { sessions: true },
    });
  }
}
