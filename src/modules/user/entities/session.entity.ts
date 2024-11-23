import { AbstractEntity } from '@/entities/abstract.entity';
import { Uuid } from '@/types';
import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('session')
export class SessionEntity extends AbstractEntity {
  constructor(data?: Partial<SessionEntity>) {
    super();
    Object.assign(this, data);
  }

  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({ name: 'signature' })
  signature: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: Uuid;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
