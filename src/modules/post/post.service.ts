import { OffsetPaginatedDto } from '@/dto/offset-pagination/paginated.dto';
import { PostQueryDto } from '@/dto/offset-pagination/query.dto';
import { type Uuid } from '@/types/branded.type';
import paginate from '@/utils/offset-paginate';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TagEntity } from '../tag/tag.entity';
import { UserEntity } from '../user/entities/user.entity';
import { PostImageEntity } from './entities/post-image.entity';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto, UpdatePostDto } from './post.dto';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);

  async create(
    authorId: Uuid,
    files: Express.Multer.File[],
    dto: CreatePostDto,
  ) {
    const author = await UserEntity.findOneOrFail({
      where: { id: authorId },
    });

    const tags = await Promise.all(
      dto.tags.map(async (name) => {
        return await TagEntity.findOneOrFail({ where: { name } });
      }),
    );

    const postImages = files.map(
      ({ path }) => new PostImageEntity({ url: path }),
    );

    const newPost = new PostEntity({
      ...dto,
      tags,
      author,
      images: postImages,
      createdBy: author.username ?? author.email,
    });

    return await PostEntity.save(newPost);
  }

  async getMany(query: PostQueryDto) {
    const builder = PostEntity.createQueryBuilder('post')
      .select([
        'post.id',
        'post.title',
        'post.slug',
        'post.content',
        'post.wordCount',
        'post.readingTime',
        'post.viewCount',
        'post.createdAt',
        'post.createdBy',
        'tags.id',
        'tags.name',
      ])
      .innerJoin('post.tags', 'tags');

    if (query.tag && query.tag !== 'undefined') {
      builder.where((qb) => {
        return (
          'post.id IN ' +
          qb
            .subQuery()
            .select('post.id')
            .from(PostEntity, 'post')
            .innerJoin('post.tags', 'tag')
            .where('tag.name = :name', { name: query.tag })
            .getQuery()
        );
      });
    }

    // ** not implemented yet
    // if (query.search) {
    //   let search = query.search.replaceAll('-', ' ').trim();
    //   builder
    //     .where('post.title LIKE :title', { title: `%${search}%` })
    //     .orWhere('post.content LIKE :content', { content: `%${search}%` });
    // }

    const { entities, metadata } = await paginate<PostEntity>(builder, query);
    return new OffsetPaginatedDto<PostEntity>(entities, metadata);
  }

  async getOne(id: Uuid) {
    return await PostEntity.findOneByOrFail({ id });
  }

  async update(userId: Uuid, postId: Uuid, dto: UpdatePostDto) {
    const found = await PostEntity.findOneOrFail({
      where: { id: postId },
      relations: ['author'],
    });

    if (found.author.id !== userId)
      throw new BadRequestException('You are not the author of this post');

    if (dto.tags) {
      found.tags = await Promise.all(
        dto.tags.map(async (name) => {
          return await TagEntity.findOneOrFail({ where: { name } });
        }),
      );
    }

    return await PostEntity.save(
      Object.assign(found, {
        ...dto,
        updatedBy: found.author.username ?? found.author.email,
      }),
    );
  }

  async remove(userId: Uuid, postId: Uuid) {
    const found = await PostEntity.findOneOrFail({
      where: { id: postId },
      relations: ['author'],
    });

    if (found.author.id !== userId)
      throw new BadRequestException('You are not the author of this post');

    return await PostEntity.remove(found);
  }
}
