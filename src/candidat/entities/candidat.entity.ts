import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';
import { ChildEntity, Column, Entity, JoinColumn, OneToMany, OneToOne} from 'typeorm';
import { Personne } from './personne.entity';

@Entity('candidat')
// @ChildEntity('candidat')
@ObjectType()
export class Candidat extends Personne{
    
    @Column()
    @IsBoolean()
    @Field(()=>Boolean)
    recommande: boolean;


    // @OneToOne(type=>Cv, cv=>cv.candidat, {cascade: true, onDelete: "CASCADE" })
    // @JoinColumn()
    // @Field(type => Cv)
    // public cv :Cv;

    // @Column()
    // @Field(type => Int)
    // public cvId: number;
    
}
