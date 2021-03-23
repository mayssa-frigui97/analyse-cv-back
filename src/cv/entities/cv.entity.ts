import { Candidature } from './../../candidat/entities/candidature.entity';
import { Candidat } from './../../candidat/entities/candidat.entity';
import { Langue } from './langue.entity';
import { Formation } from './formation.entity';
import { Experience } from './experience.entity';
import { Competence } from './competence.entity';
import { ActiviteAssociative} from './activite.associative.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { StatutCV } from 'src/enum/StatutCV';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Certificat } from './certificat.entity';

@Entity('cv')
@ObjectType()
export class Cv {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id:number;

    @Column()
    @Field({nullable:true})
    cmptLinkedin?:string;
    
    @Column()
    @Field({nullable:true})
    cmptGithub?:string;

    @Column({
        type: "enum",
        enum: StatutCV,
        default: StatutCV.RECU
    })
    @Field(type => StatutCV)
    statutCV: StatutCV;

    @ManyToMany(()=>ActiviteAssociative, activiteAssociative=>activiteAssociative.cvs)
    @JoinTable()
    @Field(type=>[ActiviteAssociative],{nullable:true})
    activiteAssociatives?: ActiviteAssociative[];

    @ManyToMany(()=>Certificat, certificat=>certificat.cvs)
    @JoinTable()
    @Field(type=>[Certificat],{nullable:true})
    certificats?: Certificat[];

    @ManyToMany(()=>Competence,competence=>competence.cvs)
    @JoinTable()
    @Field(type=>[Competence],{nullable:true})
    competences?:Competence[];

    @ManyToMany(()=>Experience, experience=>experience.cvs)
    @JoinTable()
    @Field(type=>[Experience],{nullable:true})
    experiences?: Experience[];

    @ManyToMany(()=>Formation, Formation=>Formation.cvs)
    @JoinTable()
    @Field(type=>[Formation],{nullable:true})
    formations?: Formation[];

    @ManyToMany(()=>Langue, langue=>langue.cvs)
    @JoinTable()
    @Field(type=>[Langue],{nullable:true})
    langues?: Langue[];

    @OneToMany(()=>Candidature, candidature=>candidature.cv)
    @Field(type=>[Candidature],{nullable:true})
    candidatures?: Candidature[];

    @OneToOne(()=>Candidat)
    @JoinColumn()
    @Field(type => Candidat)
    candidat :Candidat;
}