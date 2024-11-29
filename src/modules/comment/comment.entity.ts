import { AbstractEntity } from '@/database/entities/abstract.entity';
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
import { Post } from '../post/post.entity';
import { User } from '../user/entities/user.entity';

@Expose()
@Entity('comment')
export class Comment extends AbstractEntity {
  constructor(data?: Partial<Comment>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column('text')
  content: string;

  @Column({ type: 'uuid', name: 'post_id' })
  postId: Uuid;

  @Column({ type: 'uuid', name: 'author_id' })
  authorId: Uuid;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Relation<Post>;

  @ManyToOne(() => User, (author) => author.comments)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: Relation<User>;
}
