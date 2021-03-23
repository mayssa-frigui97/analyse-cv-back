import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('candidat')
@ObjectType()
export class Candidat {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field()
    nom:string;

    @Column()
    @Field()
    prenom:string;

    @Column()
    @Field()
    cin: number;

    @Column()
    @Field()
    dateNaiss: Date;

    @Column()
    @Field({nullable:true})
    adresse?: string;

    @Column()
    @Field()
    tel: number;

    @Column()
    @Field()
    @IsEmail()
    email: string;

    @Column()
    @Field({nullable:true})
    avatar?: string;

    
}
