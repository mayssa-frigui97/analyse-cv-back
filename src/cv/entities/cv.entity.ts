import { Langue } from './langue.entity';
import { Formation } from './formation.entity';
import { Experience } from './experience.entity';
import { Competence } from './competence.entity';
import { ActiviteAssociative} from './activite.associative.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { StatutCV } from 'src/enum/StatutCV';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Certificat } from './certificat.entity';
import { Personne } from '../../candidat/entities/personne.entity';

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

    @Column()
    @Field({nullable:true})
    posteAct?:string;//poste actuelle si elle existe

    @Column()
    @Field({nullable:true})
    description?:string;

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

    
    @OneToOne(type=>Personne, personne => personne.cv, {onDelete: "CASCADE" , onUpdate: "CASCADE"})
    @Field(type => Personne)
    personne :Personne;
    
    // @OneToOne(type=>Candidat, candidat => candidat.cv, {onDelete: "CASCADE" })
    // @Field(type => Candidat)
    // candidat :Candidat;

    // @OneToOne(type=>Collaborateur, col => col.cv, {onDelete: "CASCADE" })
    // @Field(type => Collaborateur)
    // collaborateur :Collaborateur;
}