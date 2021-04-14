import { Cv } from './cv.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate } from 'class-validator';

@Entity('activiteassociative')
@ObjectType()
export class ActiviteAssociative {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @IsDate()
    @Field()
    dateDebut:Date;
    
    @Column()
    @IsDate()
    @Field()
    dateFin:Date;

    @Column()
    @Field()
    association: string;

    @Column()
    @Field({nullable:true})
    poste: string;

    @Column()
    @Field({nullable:true})
    description?:string;

    @ManyToMany(()=>Cv, cv=>cv.activiteAssociatives)
    @Field(type => [Cv])
    cvs :Cv[];

}
