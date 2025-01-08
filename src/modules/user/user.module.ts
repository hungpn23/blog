import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserSchedule } from './user.schedule';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserSchedule],
})
export class UserModule {}
