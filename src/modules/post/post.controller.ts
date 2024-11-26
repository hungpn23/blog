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
    @JwtPayload() payload: JwtPayloadType,
    @Body() dto: CreatePostDto,
  ): Promise<PostEntity> {
    return await this.postService.create(payload, dto);
  }

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return await this.postService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: Uuid): Promise<PostEntity> {
    return await this.postService.findOne(id);
  }

  @Patch(':id')
  async update(
    @JwtPayload() payload: JwtPayloadType,
    @Param('id') id: Uuid,
    @Body() dto: UpdatePostDto,
  ): Promise<PostEntity> {
    return await this.postService.update(payload, id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: Uuid): Promise<PostEntity> {
    return await this.postService.remove(id);
  }
}
