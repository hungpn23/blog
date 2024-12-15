import { ApiEndpoint } from '@/decorators/endpoint.decorator';
import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { OffsetPaginatedDto } from '@/dto/offset-pagination/paginated.dto';
import { OffsetPaginationQueryDto } from '@/dto/offset-pagination/query.dto';
import { type Uuid } from '@/types/branded.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { JwtPayloadType } from '../auth/auth.type';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { Post as PostEntity } from './post.entity';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @ApiEndpoint({
    type: PostEntity,
    summary: 'create post',
  })
  @Post()
  async create(
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: CreatePostDto,
  ): Promise<PostEntity> {
    return await this.postService.create(userId, dto);
  }

  @ApiEndpoint({
    type: PostEntity,
    summary: 'get paginated posts',
    isPaginated: true,
  })
  @Get()
  async getMany(
    @Query() query: OffsetPaginationQueryDto,
  ): Promise<OffsetPaginatedDto<PostEntity>> {
    return await this.postService.getMany(query);
  }

  @ApiEndpoint({
    type: PostEntity,
    summary: 'get post by id',
    params: [
      {
        name: 'postId',
        type: () => String,
        required: true,
      },
    ],
  })
  @Get(':postId')
  async getOne(
    @Param('postId', ParseUUIDPipe) postId: Uuid,
  ): Promise<PostEntity> {
    return await this.postService.getOne(postId);
  }

  @ApiEndpoint({
    type: PostEntity,
    summary: 'update post by id',
    params: [
      {
        name: 'postId',
        type: () => String,
        required: true,
      },
    ],
  })
  @Patch(':postId')
  async update(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('postId', ParseUUIDPipe) postId: Uuid,
    @Body() dto: UpdatePostDto,
  ): Promise<PostEntity> {
    return await this.postService.update(userId, postId, dto);
  }

  @ApiEndpoint({
    type: PostEntity,
    summary: 'delete post by id',
    params: [
      {
        name: 'postId',
        type: () => String,
        required: true,
      },
    ],
  })
  @Delete(':postId')
  async remove(
    @Param('postId', ParseUUIDPipe) postId: Uuid,
  ): Promise<PostEntity> {
    return await this.postService.remove(postId);
  }
}
