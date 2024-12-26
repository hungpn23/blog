import { AbstractEntity } from '@/database/entities/abstract.entity';
import { PostEntity } from '@/modules/post/entities/post.entity';
import { type Uuid } from '@/types/branded.type';
import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Expose()
@Entity('topic')
export class TopicEntity extends AbstractEntity {
  constructor(data?: Partial<TopicEntity>) {
    super();
    Object.assign(this, data);
  }

  @ApiProperty({ type: () => String })
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => PostEntity, (post) => post.topics, { cascade: true })
  @JoinTable({
    name: 'post_topics', // Tên bảng trung gian
    joinColumn: {
      name: 'topic_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
  })
  posts: Relation<PostEntity[]>;
}
