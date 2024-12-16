import { ApiEndpoint } from '@/decorators/endpoint.decorator';
import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { type Uuid } from '@/types/branded.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { JwtPayloadType } from '../auth/auth.type';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiEndpoint({
    type: Comment,
    summary: 'create a new comment',
  })
  @Post()
  async create(
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: CreateCommentDto,
  ) {
    return await this.commentService.create(userId, dto);
  }

  @ApiEndpoint({
    type: Comment,
    summary: 'get all comments by post id',
    params: [{ name: 'postId' }],
  })
  @Get(':postId')
  findAll(@Param('postId') postId: Uuid) {
    return this.commentService.findAll(postId);
  }

  @ApiEndpoint({
    type: Comment,
    summary: 'update a comment by id, return updated comment',
    params: [{ name: 'commentId' }],
  })
  @Patch(':commentId')
  update(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('commentId') commentId: Uuid,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(userId, commentId, updateCommentDto);
  }

  @ApiEndpoint({
    type: Comment,
    summary: 'delete a comment by id, return deleted comment',
    params: [{ name: 'commentId' }],
  })
  @Delete(':commentId')
  remove(@Param('commentId') commentId: Uuid) {
    return this.commentService.remove(commentId);
  }
}
