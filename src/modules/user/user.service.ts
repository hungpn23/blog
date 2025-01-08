import { type Uuid } from '@/types/branded.type';
import { Injectable, Logger } from '@nestjs/common';
import { FollowEntity } from './entities/follow.entity';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './user.dto';

type FollowParams = {
  followerId: Uuid;
  followedId: Uuid;
};

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async findOne(userId: Uuid): Promise<UserEntity> {
    return await UserEntity.findOneOrFail({
      where: { id: userId },
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return await UserEntity.find();
  }

  async uploadAvatar(userId: Uuid, filePath: string) {
    await UserEntity.update({ id: userId }, { avatar: filePath });
    return { avatar: filePath };
  }

  async update(userId: Uuid, dto: UpdateUserDto) {
    const found = await UserEntity.findOneOrFail({ where: { id: userId } });

    await UserEntity.save(
      Object.assign(found, { ...dto, updatedBy: found.username }),
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
