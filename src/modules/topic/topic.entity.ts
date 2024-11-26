import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Post } from '@/modules/post/post.entity';
import { Uuid } from '@/types/branded.type';

import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Expose()
@Entity('topic')
export class Topic extends AbstractEntity {
  constructor(data?: Partial<Topic>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Post, (post) => post.topic)
  posts: Relation<Post[]>;
}
