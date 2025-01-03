import { AbstractEntity } from '@/database/entities/abstract.entity';
import { CommentEntity } from '@/modules/comment/comment.entity';
import { TagEntity } from '@/modules/tag/tag.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { type Uuid } from '@/types/branded.type';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { PostImageEntity } from './post-image.entity';

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

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'word_count' })
  wordCount: number;

  @Column({ name: 'reading_time' })
  readingTime: number;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @OneToMany(() => PostImageEntity, (image) => image.post, { cascade: true })
  images: Relation<PostImageEntity[]>;

  @OneToMany(() => CommentEntity, (comment) => comment.post, { cascade: true })
  comments: Relation<CommentEntity[]>;

  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: Relation<UserEntity>;

  @ManyToMany(() => TagEntity, (tag) => tag.posts)
  tags: Relation<TagEntity[]>;

  @BeforeInsert()
  @BeforeUpdate()
  async calculateExtraInfomation() {
    this.slug = slugify(this.title, { lower: true, strict: true });
    this.wordCount = this.content.split(' ').length;
    this.readingTime = Math.ceil(this.wordCount / 200);
  }
}
