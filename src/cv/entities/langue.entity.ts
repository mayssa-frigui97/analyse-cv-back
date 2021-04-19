import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cv } from './cv.entity';

@Entity('langue')
@ObjectType()
export class Langue {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field()
    nom:string;
    
    @Column()
    @Field()
    niveau:string;

    @Column({
        name: "certifie",
        type: "boolean",
        default: false
      })
    @Field()
    certifie: boolean;

    @ManyToMany(()=>Cv, cv=>cv.langues)
    @Field(type => [Cv])
    cvs :Cv[];
}
