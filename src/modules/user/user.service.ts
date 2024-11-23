import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../auth/auth.type';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  async getUser(payload: JwtPayloadType) {
    return await UserEntity.findOne({
      where: { id: payload.userId },
      relations: { sessions: true },
    });
  }
}
