import { Module } from '@nestjs/common';
import { UserListener } from './user-listener';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserListener],
})
export class UserModule {}
