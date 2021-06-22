/* eslint-disable prettier/prettier */
import { Collaborateur } from './../../collaborateur/entities/collaborateur.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Collaborateur, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn()
  user : Collaborateur;

  @Column({ default: false, name: 'is_revoked' })
  revoked: boolean;

  @Column()
  expires: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
