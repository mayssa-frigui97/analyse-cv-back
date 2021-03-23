import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cv } from './cv.entity';

@Entity('competence')
@ObjectType()
export class Competence {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field()
    nom:string;
    
    @Column()
    @Field({nullable:true})
    version?:string;

    @Column()
    @Field({nullable:true})
    niveau?: string;//nzidha lel diag classe

    @ManyToMany(()=>Cv, cv=>cv.competences)
    @Field(type => [Cv])
    cvs :Cv[];
}
