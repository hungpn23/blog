import { type Uuid } from '@/types/branded.type';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { CreateTopicDto, UpdateTopicDto } from './topic.dto';
import { Topic } from './topic.entity';

@Injectable()
export class TopicService {
  async create(userId: Uuid, dto: CreateTopicDto) {
    const user = await User.findOneByOrFail({ id: userId });

    return await Topic.save(
      new Topic({ name: dto.name, createdBy: user.username }),
    );
  }

  async findAll() {
    return await Topic.find();
  }

  async findOne(id: Uuid) {
    return await Topic.findOneByOrFail({ id });
  }

  async update(userId: Uuid, topicId: Uuid, dto: UpdateTopicDto) {
    const [user, found] = await Promise.all([
      User.findOneByOrFail({ id: userId }),
      Topic.findOneByOrFail({ id: topicId }),
    ]);

    return await Topic.save(
      Object.assign(found, {
        name: dto.name,
        updatedBy: user.username,
      } as Topic),
    );
  }

  async remove(id: Uuid) {
    const found = await Topic.findOneByOrFail({ id });
    return await Topic.remove(found);
  }
}
