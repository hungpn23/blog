import { SYSTEM } from '@/constants';
import { type Uuid } from '@/types/branded.type';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { CreateTagDto, UpdateTagDto } from './tag.dto';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  async create(userId: Uuid, dto: CreateTagDto) {
    const user = await UserEntity.findOneByOrFail({ id: userId });

    return await TagEntity.save(
      new TagEntity({ name: dto.name, createdBy: user.username ?? SYSTEM }),
    );
  }

  async findAll() {
    return await TagEntity.find();
  }

  async findOne(tagId: Uuid) {
    return await TagEntity.findOneByOrFail({ id: tagId });
  }

  async update(userId: Uuid, tagId: Uuid, { name }: UpdateTagDto) {
    const [user, found] = await Promise.all([
      UserEntity.findOneByOrFail({ id: userId }),
      TagEntity.findOneByOrFail({ id: tagId }),
    ]);

    return await TagEntity.save(
      Object.assign(found, {
        name,
        updatedBy: user.username ?? SYSTEM,
      } as TagEntity),
    );
  }

  async remove(tagId: Uuid) {
    const found = await TagEntity.findOneOrFail({ where: { id: tagId } });
    return await TagEntity.remove(found);
  }
}
