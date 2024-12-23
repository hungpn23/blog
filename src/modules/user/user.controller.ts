import { ApiEndpoint, ApiFile } from '@/decorators/endpoint.decorator';
import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { validateImagePipe } from '@/pipes/validate-image.pipe';
import { JwtPayloadType } from '@/types/auth.type';
import { Uuid } from '@/types/branded.type';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(
    private userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {}

  @ApiEndpoint({ type: UserEntity, summary: 'get user by id' })
  @Get('profile')
  async getProfile(
    @JwtPayload() { userId }: JwtPayloadType,
  ): Promise<UserEntity> {
    return await this.userService.findOne(userId);
  }

  @ApiFile('avatar')
  @ApiEndpoint({ summary: 'upload new user avatar' })
  @Post('upload-avatar')
  async uploadAvatar(
    @UploadedFile(validateImagePipe())
    file: Express.Multer.File,
    @JwtPayload() { userId }: JwtPayloadType,
  ) {
    return await this.userService.uploadAvatar(userId, file.path);
  }

  @ApiEndpoint({
    type: UserEntity,
    summary: 'update user profile, return updated profile',
  })
  @Patch('profile')
  async updateProfile(
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, dto);
  }

  @ApiEndpoint({ summary: 'follow a user' })
  @Post('follow/:followedId')
  async follow(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('followedId') followedId: Uuid,
  ): Promise<void> {
    await this.userService.follow({
      followerId: userId,
      followedId,
    });
  }

  @ApiEndpoint({ summary: 'unfollow a user' })
  @Post('unfollow/:followedId')
  async unfollow(
    @JwtPayload() { userId }: JwtPayloadType,
    @Param('followedId') followedId: Uuid,
  ): Promise<void> {
    await this.userService.unfollow({
      followerId: userId,
      followedId,
    });
  }
}
