import { ApiError } from '@/constants/index';
import { ApiException } from '@/exceptions/api.exception';
import { Uuid } from '@/types/branded.type';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../auth/auth.type';
import { User } from '../user/entities/user.entity';
import { CreateTopicDto, UpdateTopicDto } from './topic.dto';
import { Topic } from './topic.entity';

@Injectable()
export class TopicService {
  async create(payload: JwtPayloadType, dto: CreateTopicDto) {
    const [user, found] = await Promise.all([
      User.findOne({ where: { id: payload.userId } }),
      Topic.findOne({ where: { name: dto.name } }),
    ]);
    if (found) throw new ApiException(ApiError.Exist, HttpStatus.BAD_REQUEST);

    return await Topic.save(
      new Topic({ name: dto.name, createdBy: user.username }),
    );
  }

  async findAll() {
    return await Topic.find();
  }

  async findOne(id: Uuid) {
    return await Topic.findOne({ where: { id } });
  }

  async update(payload: JwtPayloadType, id: Uuid, dto: UpdateTopicDto) {
    const [user, found] = await Promise.all([
      User.findOne({ where: { id: payload.userId } }),
      Topic.findOne({ where: { id } }),
    ]);
    if (!found) throw new ApiException(ApiError.NotFound, HttpStatus.NOT_FOUND);

    return await Topic.save(
      Object.assign(found, {
        name: dto.name,
        updatedBy: user.username,
      } as Topic),
    );
  }

  async remove(id: Uuid) {
    const found = await Topic.findOne({ where: { id } });
    if (!found) throw new ApiException(ApiError.NotFound, HttpStatus.NOT_FOUND);
    return await Topic.remove(found);
  }
}
