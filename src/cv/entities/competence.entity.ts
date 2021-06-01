import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsString, IsNumber, IsAlpha } from 'class-validator';
import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cv } from './cv.entity';

@Entity('competence')
@ObjectType()
export class Competence {

    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @IsAlpha()
    @Column()
    @Field()
    nom:string;

    @IsNumber()
    @Column()
    @Field(type => Int,{nullable:true})
    version?:number;

    @ManyToMany(()=>Cv, cv=>cv.competences)
    @Field(type => [Cv])
    cvs :Cv[];

}
