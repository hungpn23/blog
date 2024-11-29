import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Topic } from '@/modules/topic/topic.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Uuid } from '@/types/branded.type';
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

@Expose()
@Entity('post')
export class Post extends AbstractEntity {
  constructor(data?: Partial<Post>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({ type: 'uuid', name: 'author_id' })
  authorId: Uuid;

  @Column({ type: 'uuid', name: 'topic_id' })
  topicId: Uuid;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Relation<Comment[]>;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: Relation<User>;

  @ManyToOne(() => Topic, (topic) => topic.posts)
  @JoinColumn({ name: 'topic_id', referencedColumnName: 'id' })
  topic: Relation<Topic>;
}
