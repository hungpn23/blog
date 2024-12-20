import { AbstractEntity } from '@/database/entities/abstract.entity';
import { TopicEntity } from '@/modules/topic/topic.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { type Uuid } from '@/types/branded.type';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { PostImageEntity } from './entities/post-image.entity';

@Expose()
@Entity('post')
export class PostEntity extends AbstractEntity {
  constructor(data?: Partial<PostEntity>) {
    super();
    Object.assign(this, data);
  }

  @ApiProperty({ type: () => String })
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @OneToMany(() => PostImageEntity, (image) => image.post, { cascade: true })
  images: Relation<PostImageEntity[]>;

  @OneToMany(() => CommentEntity, (comment) => comment.post, { cascade: true })
  comments: Relation<CommentEntity[]>;

  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: Relation<UserEntity>;

  @ManyToOne(() => TopicEntity, (topic) => topic.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id', referencedColumnName: 'id' })
  topic: Relation<TopicEntity>;
}
