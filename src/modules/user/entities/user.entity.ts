import { AbstractEntity } from '@/entities/abstract.entity';
import { Uuid } from '@/types';
import argon2 from 'argon2';
import { Exclude, Expose } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Session } from './session.entity';

@Expose()
@Entity('user')
export class User extends AbstractEntity {
  constructor(data?: Partial<User>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column({ nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
