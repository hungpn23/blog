import { ApiError } from '@/constants/index';
import { ApiException } from '@/exceptions/api.exception';
import { Uuid } from '@/types/branded.type';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../auth/auth.type';
import { Topic } from '../topic/topic.entity';
import { User } from '../user/entities/user.entity';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  async create(payload: JwtPayloadType, dto: CreatePostDto) {
    const [user, topic] = await Promise.all([
      User.findOne({ where: { id: payload.userId } }),
      Topic.findOne({ where: { id: dto.topicId } }),
    ]);
    if (!topic) throw new ApiException(ApiError.NotFound, HttpStatus.NOT_FOUND);

    return await Post.save(
      new Post({ ...dto, topic, user, createdBy: user.username }),
    );
  }

  async findAll() {
    return await Post.find();
  }

  async findOne(id: Uuid) {
    return await Post.findOne({ where: { id } });
  }

  async update(payload: JwtPayloadType, id: Uuid, dto: UpdatePostDto) {
    const [user, found] = await Promise.all([
      User.findOne({ where: { id: payload.userId } }),
      Post.findOne({ where: { id } }),
    ]);
    if (!found) throw new ApiException(ApiError.NotFound, HttpStatus.NOT_FOUND);

    return await Post.save(
      Object.assign(found, { ...dto, updatedBy: user.username } as Post),
    );
  }

  async remove(id: Uuid) {
    const found = await Post.findOne({ where: { id } });
    if (!found) throw new ApiException(ApiError.NotFound, HttpStatus.NOT_FOUND);

    return await Post.remove(found);
  }
}
