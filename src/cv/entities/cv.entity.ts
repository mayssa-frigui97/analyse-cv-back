import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Personne } from '../../candidat/entities/personne.entity';
import { IsString } from 'class-validator';
import { Competence } from './competence.entity';
import { StatutCV } from './../../enum/StatutCV';

@Entity('cv')
@ObjectType()
export class Cv {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field({ nullable: true })
  cmptLinkedin?: string;

  @Column({
    type: 'enum',
    enum: StatutCV,
    default: StatutCV.RECU,
  })
  @Field((type) => StatutCV)
  statutCV: StatutCV;

  @Column('varchar', { length: 2500 })
  @IsString()
  @Field({ nullable: true })
  activiteAssociatives?: string;

  @Column('varchar', { length: 2500 })
  @IsString()
  @Field({ nullable: true })
  certificats?: string;

  // @Column("simple-array")
  // // @IsString()
  // @Field(type => [String])
  // competences:string[];

  @Column('simple-array')
  // @IsString()
  @Field((type) => [String])
  langues: string[];

  @Column('varchar', { length: 2500 })
  @IsString()
  @Field({ nullable: true })
  experiences?: string;

  @Column('varchar', { length: 2500 })
  @IsString()
  @Field({ nullable: true })
  formations?: string;

  @Column('varchar', { length: 2500 })
  @IsString()
  @Field({ nullable: true })
  projets?: string;

  @Column('varchar', { length: 2500 })
  @IsString()
  @Field({ nullable: true })
  interets?: string;

  @OneToOne((type) => Personne, (personne) => personne.cv, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field((type) => Personne)
  personne: Personne;

  @ManyToMany(() => Competence, (competence) => competence.cvs, {
    cascade: true,
  })
  @JoinTable({
    // name: 'cv-competence',
    // joinColumn: {
    //   name: 'cvId',
    //   referencedColumnName: 'id',
    // },
    // inverseJoinColumn: {
    //   name: 'competenceId',
    //   referencedColumnName: 'id',
    //   },
  })
  @Field((type) => [Competence], { nullable: true })
  competences?: Competence[];
}
