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
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';

@SerializeOptions({ type: Comment })
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: CreateCommentDto,
  ) {
    return await this.commentService.create(userId, dto);
  }

  @Get(':postId')
  findAll(@Param('postId') postId: Uuid) {
    return this.commentService.findAll(postId);
  }

  @Patch(':commentId')
  update(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('commentId') commentId: Uuid,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(userId, commentId, updateCommentDto);
  }

  @Delete(':commentId')
  remove(@Param('commentId') commentId: Uuid) {
    return this.commentService.remove(commentId);
  }
}
