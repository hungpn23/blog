import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Post } from '@/modules/post/post.entity';
import { type Uuid } from '@/types/branded.type';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ type: () => String })
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Post, (post) => post.topic)
  posts: Relation<Post[]>;
}
