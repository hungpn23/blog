import { Uuid } from '@/types/branded.type';
import { Injectable } from '@nestjs/common';
import { Topic } from '../topic/topic.entity';
import { User } from '../user/entities/user.entity';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  async create(userId: Uuid, dto: CreatePostDto) {
    const [user, topic] = await Promise.all([
      User.findOneOrFail({ where: { id: userId } }),
      Topic.findOneOrFail({ where: { id: dto.topicId } }),
    ]);

    return await Post.save(
      new Post({ ...dto, topic, author: user, createdBy: user.username }),
    );
  }

  async getMany() {
    return await Post.find();
  }

  async getOne(id: Uuid) {
    return await Post.findOneByOrFail({ id });
  }

  async update(userId: Uuid, id: Uuid, dto: UpdatePostDto) {
    const [user, found] = await Promise.all([
      User.findOneOrFail({ where: { id: userId } }),
      Post.findOneOrFail({ where: { id } }),
    ]);

    return await Post.save(
      Object.assign(found, { ...dto, updatedBy: user.username } as Post),
    );
  }

  async remove(id: Uuid) {
    const found = await Post.findOneByOrFail({ id });
    return await Post.remove(found);
  }
}
