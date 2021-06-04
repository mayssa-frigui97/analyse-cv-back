import { UserRole } from './../../enum/UserRole';
import { Notification } from './../../notification/entities/notification.entity';
import { Equipe } from './equipe.entity';
import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';
import { BeforeInsert, ChildEntity, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Personne } from '../../candidat/entities/personne.entity';
import * as bcrypt from 'bcrypt';
import { UserPermission } from 'src/enum/UserPermission';

// @ChildEntity('collaborateur')
@Entity('collaborateur')
@ObjectType()
export class Collaborateur extends Personne{

    // @PrimaryGeneratedColumn()
    // @Field(type => Int)
    // id:number;
    @Index({ unique: true })
    @Column()
    @Field(type => Int)
    cin: number;

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

    @Column({ 
        unique: true,
        type: 'varchar', 
        nullable: false, })
    @Field()
    @MaxLength(20, {
        message: 'Le nom utilisateur doit avoir au minimum 20 caractéres !',
      })
    @MinLength(4, {
        message: 'Le nom utilisateur doit avoir au minimum 4 caractéres !',
    })
    nomUtilisateur: string;

    @Column({
        select: false,
        nullable: false
    })
    @MaxLength(20, {
        message: 'Le mot de passe doit avoir au minimum 20 caractéres !',
      })
    @MinLength(4, {
        message: 'Le mot de passe doit avoir au minimum 4 caractéres !',
    })
    @HideField()
    motDePasse: string;
    static Cv: any;

    @BeforeInsert()
    async hashPassword?(){
        this.motDePasse = await bcrypt.hash(this.motDePasse,10);
    }

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.COLLABORATEUR
    })
    @Field(type => UserRole)
    role :UserRole;

    @Column({
        type: "enum",
        enum: UserPermission,
        default: UserPermission.VISITEUR
    })
    @Field(type => UserPermission)
    permission :UserPermission;

    @Column()
    @Field(type => Int,{nullable:true})
    evaluation?: number;

    @ManyToOne(()=>Equipe, equipe=>equipe.collaborateurs)
    @IsOptional()
    @Field(type=> Equipe,{nullable:true})
    equipe? :Equipe;w

    // @Column()
    // @IsOptional()
    // @Field(type => Int,{nullable:true})
    // public equipeId?: number;

    @OneToMany(()=>Notification, notification=>notification.collaborateur)
    @Field(type=>[Notification],{nullable:true})
    notifications?: Notification[];

}
