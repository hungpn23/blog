import { Uuid } from '@/types/branded.type';
import { Injectable } from '@nestjs/common';
import { Topic } from '../topic/topic.entity';
import { User } from '../user/entities/user.entity';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  async create(authorId: Uuid, dto: CreatePostDto) {
    const [author, topic] = await Promise.all([
      User.findOneOrFail({ where: { id: authorId } }),
      Topic.findOneOrFail({ where: { id: dto.topicId } }),
    ]);

    return await Post.save(
      new Post({ ...dto, topic, author, createdBy: author.username }),
    );
  }

  async getMany() {
    return await Post.find();
  }

  async getOne(id: Uuid) {
    return await Post.findOneByOrFail({ id });
  }

  async update(authorId: Uuid, postId: Uuid, dto: UpdatePostDto) {
    const [author, found] = await Promise.all([
      User.findOneOrFail({ where: { id: authorId } }),
      Post.findOneOrFail({ where: { id: postId } }),
    ]);

    return await Post.save(
      Object.assign(found, { ...dto, updatedBy: author.username } as Post),
    );
  }

  async remove(id: Uuid) {
    const found = await Post.findOneByOrFail({ id });
    return await Post.remove(found);
  }
}
