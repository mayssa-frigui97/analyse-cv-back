import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Cv } from '../../cv/entities/cv.entity';
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, TableInheritance, Unique } from 'typeorm';
import { Candidature } from './candidature.entity';

@Entity('personne')
// @TableInheritance({ column: { type: "varchar", name: "type" } })
@ObjectType()
export class Personne {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field()
    nom:string;

    @Column()
    @Field()
    prenom:string;

    @Index({ unique: true })
    @Column()
    @Field()
    cin: number;

    @Column()
    @Field()
    dateNaiss: Date;

    @Column()
    @Field({nullable:true})
    adresse?: string;

    @Index({ unique: true })
    @Column()
    @Field()
    tel: number;

    @Index({ unique: true })
    @Column()
    @Field()
    @IsEmail()
    email: string;

    @Column()
    @Field({nullable:true})
    avatar?: string;

    @OneToOne(type => Cv, cv => cv.personne, {cascade: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn()
    @Field(type => Cv)
    public cv: Cv;

    @Index({ unique: true })
    @Column()
    @Field(type => Int)
    public cvId: number;

    @OneToMany(()=>Candidature, candidature=>candidature.personne)
    @Field(type=>[Candidature])
    candidatures: Candidature[];
    
}
