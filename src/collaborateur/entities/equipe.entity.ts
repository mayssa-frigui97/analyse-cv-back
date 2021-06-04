import { Pole } from './pole.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collaborateur } from './collaborateur.entity';

@Entity('equipe')
@ObjectType()
export class Equipe {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field()
    nom:string;

    @OneToMany(()=>Collaborateur, collaborateur=>collaborateur.equipe, { cascade: true})
    @Field(type=>[Collaborateur])
    collaborateurs: Collaborateur[];

    @ManyToOne(()=>Pole, pole=>pole.equipes)
    @Field(type => Pole)
    pole :Pole;

    @OneToOne(()=>Collaborateur)
    @JoinColumn()
    @Field(type => Collaborateur)
    teamleader :Collaborateur;

}
