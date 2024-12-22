import { type Uuid } from '@/types/branded.type';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan } from 'typeorm';
import { FollowEntity } from './entities/follow.entity';
import { SessionEntity } from './entities/session.entity';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './user.dto';

type FollowParams = {
  followerId: Uuid;
  followedId: Uuid;
};

@Injectable()
export class UserService {
  async findOne(userId: Uuid): Promise<UserEntity> {
    return await UserEntity.findOneOrFail({
      where: { id: userId },
    });
  }

  async uploadAvatar(userId: Uuid, filePath: string) {
    await UserEntity.update({ id: userId }, { avatar: filePath });
  }

  async update(userId: Uuid, dto: UpdateUserDto) {
    const found = await UserEntity.findOneOrFail({ where: { id: userId } });

    return await UserEntity.save(
      Object.assign(found, { ...dto, updatedBy: dto.username } as UserEntity),
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

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async cleanSessions() {
    const now = new Date();
    await SessionEntity.delete({ expiresAt: LessThan(now) });
  }
}
