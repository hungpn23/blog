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
import { User } from './entities/user.entity';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @ApiEndpoint({ type: User, summary: 'get current user profile' })
  @Get('profile')
  async getProfile(@JwtPayload() { userId }: JwtPayloadType): Promise<User> {
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
    type: User,
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
