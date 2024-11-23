import { ApiError } from '@/constants';
import { ApiException } from '@/exceptions/api.exception';
import { Uuid } from '@/types';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../auth/auth.type';
import { User } from '../user/entities/user.entity';
import { CreateTopicDto, UpdateTopicDto } from './topic.dto';
import { Topic } from './topic.entity';

@Injectable()
export class TopicService {
  async create(payload: JwtPayloadType, dto: CreateTopicDto) {
    const found = await Topic.findOne({ where: { name: dto.name } });
    if (found) throw new ApiException(ApiError.Exist, HttpStatus.BAD_REQUEST);

    const user = await User.findOne({ where: { id: payload.userId } });

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
    const found = await Topic.findOne({ where: { id } });
    if (!found) throw new ApiException(ApiError.NotFound, HttpStatus.NOT_FOUND);

    const user = await User.findOne({ where: { id: payload.userId } });

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
