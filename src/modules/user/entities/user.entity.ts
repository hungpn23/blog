import { Role } from '@/constants';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { CommentEntity } from '@/modules/comment/comment.entity';
import { PostEntity } from '@/modules/post/entities/post.entity';
import { type Uuid } from '@/types/branded.type';
import { ApiHideProperty } from '@nestjs/swagger';
import argon2 from 'argon2';
import { Exclude, Expose } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { FollowEntity } from './follow.entity';
import { SessionEntity } from './session.entity';

@Expose()
@Entity('user')
export class UserEntity extends AbstractEntity {
  constructor(data?: Partial<UserEntity>) {
    super();
    Object.assign(this, data);
  }

  @ApiHideProperty()
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @ApiHideProperty()
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true, unique: true })
  username?: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  isEmailVerified: boolean;

  @ApiHideProperty()
  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  avatar?: string;

  @ApiHideProperty()
  @OneToMany(() => SessionEntity, (session) => session.user, { cascade: true })
  sessions: Relation<SessionEntity[]>;

  @ApiHideProperty()
  @OneToMany(() => PostEntity, (post) => post.author, { cascade: true })
  posts: Relation<PostEntity[]>;

  @ApiHideProperty()
  @OneToMany(() => CommentEntity, (comment) => comment.author, {
    cascade: true,
  })
  comments: Relation<CommentEntity[]>;

  @ApiHideProperty()
  @OneToMany(() => FollowEntity, (follow) => follow.follower, { cascade: true })
  followers: Relation<FollowEntity[]>;

  @ApiHideProperty()
  @OneToMany(() => FollowEntity, (follow) => follow.followed, { cascade: true })
  followeds: Relation<FollowEntity[]>; // people who are being followed by others

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
