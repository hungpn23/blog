import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Uuid } from '@/types/branded.type';
import { BadRequestException } from '@nestjs/common';
import { Expose } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Expose()
@Entity('follow')
export class FollowEntity extends AbstractEntity {
  constructor(data?: Partial<FollowEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryColumn({ name: 'follower_id', type: 'uuid' })
  followerId: Uuid;

  @PrimaryColumn({ name: 'followed_id', type: 'uuid' })
  followedId: Uuid;

  @ManyToOne(() => UserEntity, (user) => user.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'follower_id', referencedColumnName: 'id' })
  follower: Relation<UserEntity>;

  @ManyToOne(() => UserEntity, (user) => user.followeds, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followed_id', referencedColumnName: 'id' })
  followed: Relation<UserEntity>;

  @BeforeInsert()
  @BeforeUpdate()
  preventFollowSelf() {
    if (this.followerId === this.followedId) {
      throw new BadRequestException(
        'Follower ID and Followed ID must be different',
      );
    }
  }
}
