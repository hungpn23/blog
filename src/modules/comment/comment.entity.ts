import { AbstractEntity } from '@/database/entities/abstract.entity';
import { type Uuid } from '@/types/branded.type';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../user/entities/user.entity';

@Expose()
@Entity('comment')
export class CommentEntity extends AbstractEntity {
  constructor(data?: Partial<CommentEntity>) {
    super();
    Object.assign(this, data);
  }

  @ApiProperty({ type: () => String })
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column('text')
  content: string;

  @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Relation<PostEntity>;

  @ManyToOne(() => UserEntity, (author) => author.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: Relation<UserEntity>;
}
