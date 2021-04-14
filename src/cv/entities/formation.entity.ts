import { Column, ManyToOne, ManyToMany } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Cv } from './cv.entity';
import { IsDate } from 'class-validator';

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
    @IsDate()
    @Field()
    dateDebut: Date;

    @Column()
    @IsDate()
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
