import { UserRole } from './../../enum/UserRole';
import { JoinColumn } from 'typeorm';
import { Equipe } from './equipe.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collaborateur } from './collaborateur.entity';

@Entity('pole')
@ObjectType()
export class Pole {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field()
    nom:string;

    @OneToMany(()=>Equipe, equipe=>equipe.pole)
    @Field(type=>[Equipe],{nullable:true})
    equipes?: Equipe[];

    @OneToOne(()=>Collaborateur)
    @JoinColumn()
    //@Column({default:Collaborateur.roles=UserRole.RP})
    @Field(type => Collaborateur)
    rp :Collaborateur;//lazem role mte3ou RP

}
