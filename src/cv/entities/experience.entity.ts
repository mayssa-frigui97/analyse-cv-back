import { Column, ManyToMany, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Cv } from './cv.entity';

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
    @Field()
    dateDebut: Date;

    @Column()
    @Field()
    dateFin: Date;

    @Column()
    @Field({nullable:true})
    description?:string;

    @ManyToMany(()=>Cv, cv=>cv.experiences)
    @Field(type => [Cv])
    cvs :Cv[];
}
