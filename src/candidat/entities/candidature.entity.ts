/* eslint-disable prettier/prettier */
import { Entretien } from './../../entretien/entities/entretien.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Personne } from './personne.entity';

@Entity('candidature')
@ObjectType()
export class Candidature {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  date: Date;

  @ManyToOne(() => Personne, (personne) => personne.candidatures)
  @Field((type) => Personne)
  personne: Personne;

  @OneToMany(() => Entretien, (entretien) => entretien.candidature)
  @Field((type) => [Entretien])
  entretiens: Entretien[];
}
