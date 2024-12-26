import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule, PostModule, TagModule, CommentModule],
})
export class Modules {}
