import { type Uuid } from '@/types/branded.type';
import { Injectable } from '@nestjs/common';
import { Post } from '../post/post.entity';
import { User } from '../user/entities/user.entity';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  async create(authorId: Uuid, postId: Uuid, dto: CreateCommentDto) {
    const [author, post] = await Promise.all([
      User.findOneByOrFail({ id: authorId }),
      Post.findOneByOrFail({ id: postId }),
    ]);
    return await Comment.save(new Comment({ ...dto, author, post }));
  }

  async findAll(postId: Uuid) {
    const found = await Post.findOneByOrFail({ id: postId });
    return await Comment.find({
      where: { post: { id: found.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async update(authorId: Uuid, commentId: Uuid, dto: UpdateCommentDto) {
    const [author, found] = await Promise.all([
      User.findOneOrFail({ where: { id: authorId } }),
      Comment.findOneOrFail({ where: { id: commentId } }),
    ]);
    return await Comment.save(
      Object.assign(found, { ...dto, updatedBy: author.username } as Comment),
    );
  }

  async remove(commentId: Uuid) {
    return await Comment.remove(
      await Comment.findOneByOrFail({ id: commentId }),
    );
  }
}
