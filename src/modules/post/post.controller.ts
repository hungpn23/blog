import { ApiArrayFiles, ApiEndpoint } from '@/decorators/endpoint.decorator';
import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { OffsetPaginatedDto } from '@/dto/offset-pagination/paginated.dto';
import { PostQueryDto } from '@/dto/offset-pagination/query.dto';
import { validateImagePipe } from '@/pipes/validate-image.pipe';
import { JwtPayloadType } from '@/types/auth.type';
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
  UploadedFiles,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { PostService } from './post.service';

@Controller({
  path: 'post',
  version: '1',
})
export class PostController {
  constructor(private postService: PostService) {}

  @ApiArrayFiles('images', CreatePostDto)
  @ApiEndpoint({
    type: PostEntity,
    summary: 'create a new file',
  })
  @Post()
  async create(
    @UploadedFiles(validateImagePipe({ required: false }))
    files: Express.Multer.File[],
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: CreatePostDto | typeof CreatePostDto, // avoid empty object bug
  ): Promise<PostEntity> {
    dto = plainToInstance(CreatePostDto, dto);
    return await this.postService.create(userId, files, dto);
  }

  @ApiEndpoint({
    type: PostEntity,
    isPaginated: true,
    summary: 'get paginated author posts by authorId',
  })
  @Get()
  async getManyByAuthorId(
    @JwtPayload() { userId }: JwtPayloadType,
    @Query() query: PostQueryDto,
  ) {
    return await this.postService.getMany(userId, query);
  }

  @ApiEndpoint({
    isPublic: true,
    isPaginated: true,
    type: PostEntity,
    summary: 'get all paginated posts',
  })
  @Get('all')
  async getAll(
    @Query() query: PostQueryDto,
  ): Promise<OffsetPaginatedDto<PostEntity>> {
    return await this.postService.getAll(query);
  }

  @ApiEndpoint({
    isPublic: true,
    type: PostEntity,
    summary: 'get a post by id',
    params: [{ name: 'postId' }],
  })
  @Get(':postId')
  async getOne(
    @Param('postId', ParseUUIDPipe) postId: Uuid,
  ): Promise<PostEntity> {
    return await this.postService.getOne(postId);
  }

  @ApiEndpoint({
    type: PostEntity,
    summary: 'update a post by id, return updated post',
    params: [{ name: 'postId' }],
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
    summary: 'delete a post by id, return deleted post',
    params: [{ name: 'postId' }],
  })
  @Delete(':postId')
  async remove(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('postId', ParseUUIDPipe) postId: Uuid,
  ): Promise<PostEntity> {
    return await this.postService.remove(userId, postId);
  }
}
