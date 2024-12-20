import { OffsetPaginatedDto } from '@/dto/offset-pagination/paginated.dto';
import { OffsetPaginationQueryDto } from '@/dto/offset-pagination/query.dto';
import { type Uuid } from '@/types/branded.type';
import paginate from '@/utils/offset-paginate';
import { Injectable } from '@nestjs/common';
import { TopicEntity } from '../topic/topic.entity';
import { UserEntity } from '../user/entities/user.entity';
import { PostImageEntity } from './entities/post-image.entity';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { PostEntity } from './post.entity';

@Injectable()
export class PostService {
  async create(
    authorId: Uuid,
    topicId: Uuid,
    files: Express.Multer.File[],
    dto: CreatePostDto,
  ) {
    const [author, topic] = await Promise.all([
      UserEntity.findOneOrFail({ where: { id: authorId } }),
      TopicEntity.findOneOrFail({ where: { id: topicId } }),
    ]);

    const postImages = files.map(
      ({ path }) => new PostImageEntity({ url: path }),
    );

    const newPost = new PostEntity({
      ...dto,
      topic,
      author,
      images: postImages,
      createdBy: author.username ?? author.email,
    });

    return await PostEntity.save(newPost);
  }

  async getMany(query: OffsetPaginationQueryDto) {
    let builder = PostEntity.createQueryBuilder('post');
    if (query.search) {
      let search = query.search.replaceAll('-', ' ').trim();
      builder
        .where('post.title LIKE :title', { title: `%${search}%` })
        .orWhere('post.content LIKE :content', { content: `%${search}%` });
    }

    const { entities, metadata } = await paginate<PostEntity>(builder, query);
    return new OffsetPaginatedDto<PostEntity>(entities, metadata);
  }

  async getOne(id: Uuid) {
    return await PostEntity.findOneByOrFail({ id });
  }

  async update(authorId: Uuid, postId: Uuid, dto: UpdatePostDto) {
    const [author, found] = await Promise.all([
      UserEntity.findOneOrFail({ where: { id: authorId } }),
      PostEntity.findOneOrFail({ where: { id: postId } }),
    ]);

    return await PostEntity.save(
      Object.assign(found, {
        ...dto,
        updatedBy: author.username,
      } as PostEntity),
    );
  }

  async remove(postId: Uuid) {
    const found = await PostEntity.findOneByOrFail({ id: postId });
    return await PostEntity.remove(found);
  }
}
