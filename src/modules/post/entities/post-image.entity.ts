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
import { PostEntity } from '../post.entity';

@Expose()
@Entity('post_image')
export class PostImageEntity extends AbstractEntity {
  constructor(data?: Partial<PostImageEntity>) {
    super();
    Object.assign(this, data);
  }

  @ApiProperty({ type: () => String })
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column()
  url: string;

  @ManyToOne(() => PostEntity, (post) => post.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Relation<PostEntity>;
}
