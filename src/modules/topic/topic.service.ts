import { SYSTEM } from '@/constants';
import { type Uuid } from '@/types/branded.type';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { CreateTopicDto, UpdateTopicDto } from './topic.dto';
import { TopicEntity } from './topic.entity';

@Injectable()
export class TopicService {
  async create(userId: Uuid, dto: CreateTopicDto) {
    const user = await UserEntity.findOneByOrFail({ id: userId });

    return await TopicEntity.save(
      new TopicEntity({ name: dto.name, createdBy: user.username ?? SYSTEM }),
    );
  }

  async findAll() {
    return await TopicEntity.find();
  }

  async findOne(id: Uuid) {
    return await TopicEntity.findOneByOrFail({ id });
  }

  async update(userId: Uuid, topicId: Uuid, dto: UpdateTopicDto) {
    const [user, found] = await Promise.all([
      UserEntity.findOneByOrFail({ id: userId }),
      TopicEntity.findOneByOrFail({ id: topicId }),
    ]);

    return await TopicEntity.save(
      Object.assign(found, {
        name: dto.name,
        updatedBy: user.username ?? SYSTEM,
      } as TopicEntity),
    );
  }

  async remove(id: Uuid) {
    const found = await TopicEntity.findOneByOrFail({ id });
    return await TopicEntity.remove(found);
  }
}
