import { JwtPayload } from '@/decorators/jwt-payload.decorator';
import { multerStorage } from '@/utils/multer-storage';
import {
  Controller,
  Get,
  ParseFilePipeBuilder,
  Patch,
  Post,
  SerializeOptions,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { JwtPayloadType } from '../auth/auth.type';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @SerializeOptions({ type: User })
  @Get('profile')
  profile(@JwtPayload() { userId }: JwtPayloadType): Observable<User> {
    return this.userService.findOne(userId);
  }

  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('avatar', { storage: multerStorage('avatars') }),
  )
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

  @Patch('/profile')
  async updateUser() {
    return 'update profile';
  }
}
