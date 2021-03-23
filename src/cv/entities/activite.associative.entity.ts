import { Cv } from './cv.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('activiteassociative')
@ObjectType()
export class ActiviteAssociative {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field()
    dateDebut:Date;
    
    @Column()
    @Field()
    dateFin:Date;

    @Column()
    @Field()
    association: string;

    @Column()
    @Field({nullable:true})
    poste: string;

    @ManyToMany(()=>Cv, cv=>cv.activiteAssociatives)
    @Field(type => [Cv])
    cvs :Cv[];

}