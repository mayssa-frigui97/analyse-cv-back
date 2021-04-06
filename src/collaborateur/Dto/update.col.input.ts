import { UserRole } from './../../enum/UserRole';
import { Pole } from './../entities/pole.entity';
import { Field, Int, InputType } from '@nestjs/graphql';
import { IsAlpha, IsAlphanumeric, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, IsEmail } from 'class-validator';

@InputType()//representation mta3 input = dto
export class UpdateColInput {

    @IsOptional()
    @IsInt()
    @Field(type => Int,{nullable:true})
    tel?: number;

    @IsOptional()
    @IsEmail()
    @Field()
    email: string;

    @IsString()
    @IsOptional()
    @IsAlpha()
    @Field({nullable:true})
    poste: string;

    @IsNumber()
    @IsOptional()
    @Field(type => Int,{nullable:true})
    salaire: number;

    @IsDate()
    @IsOptional()
    @Field({nullable:true})
    dateEmb: Date;

    @MaxLength(20, {
        message: 'Nom utilisateur is too long',
      })
    @IsAlphanumeric()
    @IsOptional()
    @Field({nullable:true})
    nomUtilisateur: string;

    @MaxLength(20, {
        message: 'Mot de passe is too long',
      })
    @MinLength(4, {
        message: 'Mot de passe is too short',
    })
    @IsAlphanumeric()
    @IsOptional()
    @Field({nullable:true})
    motDePasse: string;

    @IsNumber()
    @IsOptional()
    @Field(type=> [UserRole])
    roles: UserRole[];

    @MaxLength(5, {
      message: 'Evaluation max=5',
    })
    @MinLength(0, {
      message: 'Evaluation min=0',
    })
    @IsNumber()
    @IsOptional()
    @Field(type => Int)
    evaluation?: number;

    // @IsOptional()
    // @Field(type => Equipe,{nullable:true})
    // equipe? :Equipe;

    // @IsOptional()
    // @Field(type => Cv,{nullable:true})
    // cv? :Cv;

}