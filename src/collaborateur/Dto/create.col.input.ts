import { Cv } from '../../cv/entities/cv.entity';
import { Field, Int, InputType, ID } from '@nestjs/graphql';
import { IsAlpha, IsAlphanumeric, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { UserRole } from '../../enum/UserRole';
import { Equipe } from '../entities/equipe.entity';

@InputType()//representation mta3 input = dto
export class CreateColInput {

    @IsOptional()
    @IsInt()
    @Field(type => Int,{nullable:true})
    tel?: number;

    @IsString()
    @IsNotEmpty()
    @IsAlpha()
    @Field()
    poste: string;

    @IsNumber()
    @IsNotEmpty()
    @Field(type => Int)
    salaire: number;

    @IsDate()
    @IsNotEmpty()
    @Field()
    dateEmb: Date;

    @MaxLength(20, {
        message: 'Nom utilisateur is too long',
      })
    @IsAlphanumeric()
    @IsNotEmpty()
    @Field()
    nomUtilisateur: string;

    @MaxLength(20, {
        message: 'Mot de passe is too long',
      })
    @MinLength(4, {
        message: 'Mot de passe is too short',
    })
    @IsAlphanumeric()
    @IsNotEmpty()
    @Field()
    motDePasse: string;

    @IsNotEmpty()
    @Field(type => [UserRole])
    roles: UserRole[];

    @Max(5, {
      message: 'Evaluation max=5',
    })
    @Min(0, {
      message: 'Evaluation min=0',
    })
    @IsNumber()
    @IsOptional()
    @Field(type => Int,{nullable:true})
    evaluation?: number;

    @IsOptional()
    @Field(type => ID)
    equipeId :number;

    // @IsNotEmpty()
    // @Field(type => Cv)
    // cv :Cv;

    // @IsNumber()
    // @IsOptional()
    // @Field(type => Int,{nullable:true})
    // equipeId? :number;

    // @IsNumber()
    // @IsNotEmpty()
    // @Field(type => Int)
    // cvId :number;

}


/*@Contains('hello')
@IsEnum(entity: object)
@IsMilitaryTime()
@IsHash(algorithm: strin
*/