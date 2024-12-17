import { OffsetPaginatedDto } from '@/dto/offset-pagination/paginated.dto';
import { OffsetPaginationQueryDto } from '@/dto/offset-pagination/query.dto';
import { type Uuid } from '@/types/branded.type';
import paginate from '@/utils/offset-paginate';
import { Injectable } from '@nestjs/common';
import { Topic } from '../topic/topic.entity';
import { User } from '../user/entities/user.entity';
import { PostImage } from './entities/post-image.entity';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  async create(
    authorId: Uuid,
    topicId: Uuid,
    files: Express.Multer.File[],
    dto: CreatePostDto,
  ) {
    const [author, topic] = await Promise.all([
      User.findOneOrFail({ where: { id: authorId } }),
      Topic.findOneOrFail({ where: { id: topicId } }),
    ]);

    const postImages = files.map(({ path }) => new PostImage({ url: path }));

    const newPost = new Post({
      ...dto,
      topic,
      author,
      images: postImages,
      createdBy: author.username ?? author.email,
    });

    return await Post.save(newPost);
  }

  async getMany(query: OffsetPaginationQueryDto) {
    let builder = Post.createQueryBuilder('post');
    if (query.search) {
      let search = query.search.replaceAll('-', ' ').trim();
      builder
        .where('post.title LIKE :title', { title: `%${search}%` })
        .orWhere('post.content LIKE :content', { content: `%${search}%` });
    }

    const { entities, metadata } = await paginate<Post>(builder, query);
    return new OffsetPaginatedDto<Post>(entities, metadata);
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

  async remove(postId: Uuid) {
    const found = await Post.findOneByOrFail({ id: postId });
    return await Post.remove(found);
  }
}
