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
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Expose()
@Entity('tag')
export class TagEntity extends AbstractEntity {
  constructor(data?: Partial<TagEntity>) {
    super();
    Object.assign(this, data);
  }

  @ApiProperty({ type: () => String })
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => PostEntity, (post) => post.tags, { cascade: true })
  @JoinTable({
    name: 'post_tags', // Tên bảng trung gian
    joinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
  })
  posts: Relation<PostEntity[]>;
}
