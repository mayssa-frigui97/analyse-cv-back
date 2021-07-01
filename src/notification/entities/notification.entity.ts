import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Collaborateur } from 'src/collaborateur/entities/collaborateur.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notification')
@ObjectType()
export class Notification {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @CreateDateColumn()
  @Field()
  date: Date; //nzidha lel diag de classe

  @Column()
  @Field()
  description: string;

  @Column({ default: false })
  @Field()
  lu: boolean;

  @ManyToOne(
    () => Collaborateur,
    (collaborateur) => collaborateur.notifications,
  )
  @Field((type) => Collaborateur)
  collaborateur: Collaborateur;
}
