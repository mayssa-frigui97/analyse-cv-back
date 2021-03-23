import { Entretien } from './../../entretien/entities/entretien.entity';
import { Cv } from './../../cv/entities/cv.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('candidature')
@ObjectType()
export class Candidature {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field()
    date:Date;

    @ManyToOne(()=>Cv, cv=>cv.candidatures)
    @Field(type => Cv)
    cv :Cv;

    @OneToMany(()=>Entretien, entretien=>entretien.candidature)
    @Field(type=>[Entretien])
    entretiens :Entretien[];
}
