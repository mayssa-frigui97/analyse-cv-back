import { UserRole } from './../../enum/UserRole';
import { Notification } from './../../notification/entities/notification.entity';
import { Equipe } from './equipe.entity';
import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';
import { ChildEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { IsEmail, IsOptional } from 'class-validator';
import { Personne } from '../../candidat/entities/personne.entity';
import { Cv } from 'src/cv/entities/cv.entity';

// @ChildEntity('collaborateur')
@Entity('collaborateur')
@ObjectType()
export class Collaborateur extends Personne{

    // @PrimaryGeneratedColumn()
    // @Field(type => Int)
    // id:number;

    @Column()
    @Field(type => Int)
    telPro: number;

    @Column()
    @IsEmail()
    @Field()
    emailPro: string;

    @Column()
    @Field()
    poste: string;

    @Column()
    @Field(type => Int)
    salaire: number;

    @Column({nullable: true})
    @Field({nullable: true})
    dateEmb?: Date;

    @Column({ unique: true })
    @Field()
    nomUtilisateur: string;

    @Column({select: false})
    @HideField()
    motDePasse: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.COLLABORATEUR
    })
    @Field(type => UserRole)
    role :UserRole;

    @Column()
    @Field(type => Int,{nullable:true})
    evaluation?: number;

    @ManyToOne(()=>Equipe, equipe=>equipe.collaborateurs, {onDelete: 'CASCADE'})
    @IsOptional()
    @Field(type=> Equipe,{nullable:true})
    equipe? :Equipe;

    // @Column()
    // @IsOptional()
    // @Field(type => Int,{nullable:true})
    // public equipeId?: number;

    @OneToMany(()=>Notification, notification=>notification.collaborateur)
    @Field(type=>[Notification],{nullable:true})
    notifications?: Notification[];

    // @OneToOne(type=>Cv, cv=>cv.collaborateur, {cascade: true, onDelete: "CASCADE" })
    // @JoinColumn()
    // @Field(type => Cv)
    // public cv :Cv;

    // @Column()
    // @Field(type => Int)
    // public cvId: number;


    // @BeforeInsert()
    // async hashPassword(){
    //     this.mot_de_passe = await bcrypt.hash(this.mot_de_passe,10);
    // }

}
