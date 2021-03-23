import { Column, ManyToOne, ManyToMany } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Cv } from './cv.entity';

@Entity('formation')
@ObjectType()
export class Formation {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field()
    universite:string;
    
    @Column()
    @Field()
    diplome:string;

    @Column()
    @Field()
    dateDebut: Date;

    @Column()
    @Field()
    dateFin: Date;

    @Column()
    @Field()
    specialite:string;

    @Column()
    @Field()
    niveau:string;

    @Column()
    @Field({nullable:true})
    mention?:string;

    @ManyToMany(()=>Cv, cv=>cv.formations)
    @Field(type => [Cv])
    cvs :Cv[];
}
