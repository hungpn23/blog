import { Role } from '@/constants';
import { UseRole } from '@/decorators/auth/role.decorator';
import { ApiEndpoint, ApiFile } from '@/decorators/endpoint.decorator';
import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { validateImagePipe } from '@/pipes/validate-image.pipe';
import { JwtPayloadType } from '@/types/auth.type';
import { Uuid } from '@/types/branded.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto, UploadAvatarResponseDto } from './user.dto';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @ApiEndpoint({ type: UserEntity, summary: 'get user by id' })
  @Get()
  async getOne(@JwtPayload() { userId }: JwtPayloadType): Promise<UserEntity> {
    return await this.userService.findOne(userId);
  }

  @UseRole(Role.ADMIN)
  @ApiEndpoint({ type: UserEntity, summary: 'get all users' })
  @Get('all')
  async getAll(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @ApiEndpoint({
    type: UserEntity,
    summary: 'update user profile, return updated profile',
  })
  @Patch()
  async updateProfile(
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: UpdateUserDto,
  ): Promise<UserEntity> {
    return await this.userService.update(userId, dto);
  }

  @ApiFile('avatar')
  @ApiEndpoint({
    type: UploadAvatarResponseDto,
    summary: 'upload new user avatar',
  })
  @Post('upload-avatar')
  async uploadAvatar(
    @UploadedFile(validateImagePipe())
    file: Express.Multer.File,
    @JwtPayload() { userId }: JwtPayloadType,
  ): Promise<UploadAvatarResponseDto> {
    return await this.userService.uploadAvatar(userId, file);
  }

  @ApiEndpoint({ summary: 'delete user avatar' })
  @Delete('delete-avatar')
  async deleteAvatar(@JwtPayload() { userId }: JwtPayloadType): Promise<void> {
    await this.userService.deleteAvatar(userId);
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
