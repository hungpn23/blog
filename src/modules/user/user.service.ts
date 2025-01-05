import { type Uuid } from '@/types/branded.type';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
  private readonly logger = new Logger(UserService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  async findOne(userId: Uuid): Promise<UserEntity> {
    return await UserEntity.findOneOrFail({
      where: { id: userId },
    });
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

    // TODO: real-time notification
    this.eventEmitter.emit('user.follow', { follower, followed });

    await FollowEntity.save(new FollowEntity({ follower, followed }));
  }

  async unfollow({ followerId, followedId }: FollowParams): Promise<void> {
    const follow = await FollowEntity.findOneOrFail({
      where: { follower: { id: followerId }, followed: { id: followedId } },
    });

    // TODO: real-time notification
    this.eventEmitter.emit('user.follow');

    await FollowEntity.remove(follow);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async cleanSessions() {
    const now = new Date();
    await SessionEntity.delete({ expiresAt: LessThan(now) });
    this.logger.log('cleaned expired sessions');
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async updateAvatarUrl() {
  //   this.logger.log('update avatar url');
  // }
}
