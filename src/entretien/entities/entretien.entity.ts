import { Candidature } from './../../candidat/entities/candidature.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { StatutEntretien } from './../../enum/StatutEntretien';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('entretien')
@ObjectType()
export class Entretien {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  date: Date;

  @Column()
  @Field()
  duree: string;

  @Column({
    type: 'enum',
    enum: StatutEntretien,
    default: StatutEntretien.PLANIFIE,
  })
  @Field((type) => StatutEntretien)
  statut: StatutEntretien; // enum lazem tetraka7

  @Column()
  @Field({ nullable: true })
  raisonAnnulation?: string;

  @ManyToOne(() => Candidature, (candidature) => candidature.entretiens)
  @Field((type) => Candidature)
  candidature: Candidature;
}
