import { Cv } from './cv.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate } from 'class-validator';

@Entity('certificat')
@ObjectType()
export class Certificat {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field()
    dateObtention:Date;
    
    @Column()
    @IsDate()
    @Field({nullable:true})
    dateExpiration?:Date;

    @Column()
    @IsDate()
    @Field()
    organisation: string;

    @Column()
    @Field({nullable:true})
    niveau?: string;

    @ManyToMany(()=>Cv, cv=>cv.certificats)
    @Field(type => [Cv])
    cvs :Cv[];
}
