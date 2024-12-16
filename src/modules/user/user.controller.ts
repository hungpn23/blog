import { ApiEndpoint } from '@/decorators/endpoint.decorator';
import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { multerStorage } from '@/utils/multer-storage';
import {
  Controller,
  Get,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiExcludeEndpoint } from '@nestjs/swagger';
import { JwtPayloadType } from '../auth/auth.type';
import { User } from './entities/user.entity';
import { UploadAvatarDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiEndpoint({ type: User })
  @Get('profile')
  async profile(@JwtPayload() { userId }: JwtPayloadType): Promise<User> {
    return await this.userService.findOne(userId);
  }

  @UseInterceptors(
    FileInterceptor('avatar', { storage: multerStorage('avatars') }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadAvatarDto })
  @ApiEndpoint()
  @Post('upload-avatar')
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpeg|jpg|png)/,
        })
        .addMaxSizeValidator({
          maxSize: 3 * 1000 * 1000, // 3 MB
        })
        .build(),
    )
    file: Express.Multer.File,

    @JwtPayload() { userId }: JwtPayloadType,
  ) {
    return await this.userService.uploadAvatar(userId, file.path);
  }

  @ApiExcludeEndpoint()
  @Patch('/profile')
  async updateUser() {
    return 'update profile';
  }
}
