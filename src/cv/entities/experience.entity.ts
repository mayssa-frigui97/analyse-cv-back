import { Column, ManyToMany, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Cv } from './cv.entity';
import { IsDate } from 'class-validator';

@Entity('experience')
@ObjectType()
export class Experience {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field()
    societe:string;
    
    @Column()
    @Field({nullable:true})
    poste?:string;

    @Column()
    @IsDate()
    @Field()
    dateDebut: Date;

    @Column()
    @IsDate()
    @Field()
    dateFin: Date;

    @Column()
    @Field({nullable:true})
    description?:string;

    @Column()
    @Field({nullable:true})
    motCles?:string;

    @ManyToMany(()=>Cv, cv=>cv.experiences)
    @Field(type => [Cv])
    cvs :Cv[];
}
