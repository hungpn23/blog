import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { OffsetPaginatedDto } from '@/dto/offset-pagination/paginated.dto';
import { OffsetPaginationQueryDto } from '@/dto/offset-pagination/query.dto';
import { Uuid } from '@/types/branded.type';
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
  SerializeOptions,
} from '@nestjs/common';
import { JwtPayloadType } from '../auth/auth.type';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { Post as PostEntity } from './post.entity';
import { PostService } from './post.service';

@SerializeOptions({ type: PostEntity })
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  async create(
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: CreatePostDto,
  ): Promise<PostEntity> {
    return await this.postService.create(userId, dto);
  }

  @SerializeOptions({ type: OffsetPaginatedDto<PostEntity> })
  @Get()
  async getMany(
    @Query() query: OffsetPaginationQueryDto,
  ): Promise<OffsetPaginatedDto<PostEntity>> {
    return await this.postService.getMany(query);
  }

  @Get(':postId')
  async getOne(
    @Param('postId', ParseUUIDPipe) postId: Uuid,
  ): Promise<PostEntity> {
    return await this.postService.getOne(postId);
  }

  @Patch(':postId')
  async update(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('postId', ParseUUIDPipe) postId: Uuid,
    @Body() dto: UpdatePostDto,
  ): Promise<PostEntity> {
    return await this.postService.update(userId, postId, dto);
  }

  @Delete(':postId')
  async remove(
    @Param('postId', ParseUUIDPipe) postId: Uuid,
  ): Promise<PostEntity> {
    return await this.postService.remove(postId);
  }
}
