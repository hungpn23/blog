import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Topic } from '@/modules/topic/topic.entity';
import { User } from '@/modules/user/entities/user.entity';
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
import { Comment } from '../comment/comment.entity';
import { PostImage } from './entities/post-image.entity';

@Expose()
@Entity('post')
export class Post extends AbstractEntity {
  constructor(data?: Partial<Post>) {
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

  @OneToMany(() => PostImage, (image) => image.post, { cascade: true })
  images: Relation<PostImage[]>;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Relation<Comment[]>;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: Relation<User>;

  @ManyToOne(() => Topic, (topic) => topic.posts)
  @JoinColumn({ name: 'topic_id', referencedColumnName: 'id' })
  topic: Relation<Topic>;
}
