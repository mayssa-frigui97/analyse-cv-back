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

    @OneToMany(type=>Collaborateur, collaborateur=>collaborateur.equipe,{ cascade: ["insert"] })
    @Field(type=>[Collaborateur])
    collaborateurs: Collaborateur[];
    // @Field(type => [Rate])
    // @OneToMany(type => Rate, rate => rate.recipe, { cascade: ["insert"] })
    // ratings: Rate[];

    @ManyToOne(()=>Pole, pole=>pole.equipes)
    @Field(type => Pole)
    pole :Pole;

    @OneToOne(()=>Collaborateur)
    @JoinColumn()
    @Field(type => Collaborateur)
    teamleader :Collaborateur;//lazem role mte3ou teamleader

}
