import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { Controller, Get, Post, SerializeOptions } from '@nestjs/common';
import { JwtPayloadType } from '../auth/auth.type';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @SerializeOptions({ type: User })
  @Get('me')
  async getUser(@JwtPayload() payload: JwtPayloadType): Promise<User> {
    return await this.userService.getUser(payload);
  }

  @Post('/me/update')
  async updateUser() {
    return 'update profile';
  }
}
