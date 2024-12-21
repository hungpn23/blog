import { type Uuid } from '@/types/branded.type';
import { Injectable } from '@nestjs/common';
import { PostEntity } from '../post/entities/post.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  async create(authorId: Uuid, postId: Uuid, dto: CreateCommentDto) {
    const [author, post] = await Promise.all([
      UserEntity.findOneByOrFail({ id: authorId }),
      PostEntity.findOneByOrFail({ id: postId }),
    ]);
    return await CommentEntity.save(
      new CommentEntity({ ...dto, author, post }),
    );
  }

  async findAll(postId: Uuid) {
    const found = await PostEntity.findOneByOrFail({ id: postId });
    return await CommentEntity.find({
      where: { post: { id: found.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async update(authorId: Uuid, commentId: Uuid, dto: UpdateCommentDto) {
    const [author, found] = await Promise.all([
      UserEntity.findOneOrFail({ where: { id: authorId } }),
      CommentEntity.findOneOrFail({ where: { id: commentId } }),
    ]);
    return await CommentEntity.save(
      Object.assign(found, {
        ...dto,
        updatedBy: author.username,
      } as CommentEntity),
    );
  }

  async remove(commentId: Uuid) {
    return await CommentEntity.remove(
      await CommentEntity.findOneByOrFail({ id: commentId }),
    );
  }
}
