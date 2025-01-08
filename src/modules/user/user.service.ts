import { Milliseconds, type Uuid } from '@/types/branded.type';
import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import { CloudfrontService } from '../aws/cloudfront.service';
import { S3Service } from '../aws/s3.service';
import { FollowEntity } from './entities/follow.entity';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto, UploadAvatarResponseDto } from './user.dto';

type FollowParams = {
  followerId: Uuid;
  followedId: Uuid;
};

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private s3Service: S3Service,
    private cloudfrontService: CloudfrontService,
  ) {}

  async findOne(userId: Uuid): Promise<UserEntity> {
    const user = await UserEntity.findOneOrFail({
      where: { id: userId },
    });

    user.avatar = this.cloudfrontService.getFileUrl(
      user.avatar,
      (7 * 24 * 60 * 60 * 1000) as Milliseconds,
    );

    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    return await UserEntity.find();
  }

  async update(userId: Uuid, dto: UpdateUserDto) {
    const found = await UserEntity.findOneOrFail({ where: { id: userId } });

    return await UserEntity.save(
      Object.assign(found, { ...dto, updatedBy: found.username }),
    );
  }

  async uploadAvatar(userId: Uuid, file: Express.Multer.File) {
    file.buffer = await sharp(file.buffer)
      .resize({ height: 200, width: 200, fit: 'contain' })
      .toBuffer();

    const [user, fileName] = await Promise.all([
      UserEntity.findOneByOrFail({ id: userId }),
      this.s3Service.uploadFile(file),
    ]);

    await UserEntity.save(
      Object.assign(user, {
        avatar: fileName,
        updatedBy: user.username,
      }),
    );

    return {
      avatarUrl: this.cloudfrontService.getFileUrl(
        fileName,
        (7 * 24 * 60 * 60 * 1000) as Milliseconds,
      ),
    } as UploadAvatarResponseDto;
  }

  async deleteAvatar(userId: Uuid) {
    const user = await UserEntity.findOneByOrFail({ id: userId });
    await this.s3Service.deleteFile(user.avatar);
    await UserEntity.save(
      Object.assign(user, { avatar: null, updatedBy: user.username }),
    );
  }

  async follow({ followerId, followedId }: FollowParams): Promise<void> {
    const [follower, followed] = await Promise.all([
      await UserEntity.findOneByOrFail({ id: followerId }),
      await UserEntity.findOneByOrFail({ id: followedId }),
    ]);

    await FollowEntity.save(new FollowEntity({ follower, followed }));
  }

  async unfollow({ followerId, followedId }: FollowParams): Promise<void> {
    const follow = await FollowEntity.findOneOrFail({
      where: { follower: { id: followerId }, followed: { id: followedId } },
    });

    await FollowEntity.remove(follow);
  }
}
