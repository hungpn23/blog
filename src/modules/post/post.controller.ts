import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { Uuid } from '@/types/branded.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

  @Get()
  async getMany(): Promise<PostEntity[]> {
    return await this.postService.getMany();
  }

  @Get(':postId')
  async getOne(@Param('postId') postId: Uuid): Promise<PostEntity> {
    return await this.postService.getOne(postId);
  }

  @Patch(':postId')
  async update(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('postId') postId: Uuid,
    @Body() dto: UpdatePostDto,
  ): Promise<PostEntity> {
    return await this.postService.update(userId, postId, dto);
  }

  @Delete(':postId')
  async remove(@Param('postId') postId: Uuid): Promise<PostEntity> {
    return await this.postService.remove(postId);
  }
}
