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

import { JwtPayloadType } from '@/types/auth.type';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';

@Controller({
  path: 'comment',
  version: '1',
})
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiEndpoint({
    type: CommentEntity,
    summary: 'create a new comment',
    params: [{ name: 'postId' }],
  })
  @Post(':postId')
  async create(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('postId') postId: Uuid,
    @Body()
    dto: CreateCommentDto,
  ) {
    return await this.commentService.create(userId, postId, dto);
  }

  @ApiEndpoint({
    type: CommentEntity,
    summary: 'get all comments by post id',
    params: [{ name: 'postId' }],
  })
  @Get(':postId')
  async findAll(@Param('postId') postId: Uuid) {
    return await this.commentService.findAll(postId);
  }

  @ApiEndpoint({
    type: CommentEntity,
    summary: 'update a comment by id, return updated comment',
    params: [{ name: 'commentId' }],
  })
  @Patch(':commentId')
  async update(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('commentId') commentId: Uuid,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentService.update(
      userId,
      commentId,
      updateCommentDto,
    );
  }

  @ApiEndpoint({
    type: CommentEntity,
    summary: 'delete a comment by id, return deleted comment',
    params: [{ name: 'commentId' }],
  })
  @Delete(':commentId')
  async remove(@Param('commentId') commentId: Uuid) {
    return await this.commentService.remove(commentId);
  }
}
