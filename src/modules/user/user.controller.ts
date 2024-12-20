import { ApiEndpoint, ApiFile } from '@/decorators/endpoint.decorator';
import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { validateImagePipe } from '@/pipes/validate-image.pipe';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { JwtPayloadType } from '../auth/auth.type';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @ApiEndpoint({ type: UserEntity, summary: 'get current user profile' })
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
  @Patch('/profile')
  async updateProfile(
    @JwtPayload() { userId }: JwtPayloadType,
    @Body() dto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, dto);
  }
}
