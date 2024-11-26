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
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Expose()
@Entity('post')
export class Post extends AbstractEntity {
  constructor(data?: Partial<Post>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: Uuid;

  @Column({ type: 'uuid', name: 'topic_id' })
  topicId: Uuid;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Relation<User>;

  @ManyToOne(() => Topic, (topic) => topic.posts)
  @JoinColumn({ name: 'topic_id', referencedColumnName: 'id' })
  topic: Relation<Topic>;
}
