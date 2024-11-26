import { AuthModule } from "@/modules/auth/auth.module";
import { UserModule } from "@/modules/user/user.module";
import { Module } from "@nestjs/common";
import { PostModule } from "./post/post.module";
import { TopicModule } from "./topic/topic.module";

@Module({
  imports: [UserModule, AuthModule, PostModule, TopicModule],
})
export class Modules {}
