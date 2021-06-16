/* eslint-disable prettier/prettier */
import { Field, Int, InputType } from '@nestjs/graphql';
import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CreatePersonneInput } from 'src/candidat/dto/create-personne.input';
import { UserPermission } from 'src/enum/UserPermission';
import { Index } from 'typeorm';
import { UserRole } from '../../enum/UserRole';
import { Equipe } from '../entities/equipe.entity';

@InputType() //representation mta3 input = dto
export class CreateColInput extends CreatePersonneInput {
  @IsNumber()
  @Index({ unique: true })
  @IsNotEmpty()
  @Field((type) => Int)
  cin: number;

  @IsOptional()
  @IsInt()
  @Field((type) => Int, { nullable: true })
  telPro?: number;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  emailPro: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  poste: string;

  @IsNumber()
  @IsNotEmpty()
  @Field((type) => Int)
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

  @IsNotEmpty()
  @Field((type) => UserRole)
  role: UserRole;

  @IsNotEmpty()
  @Field((type) => UserPermission)
  permission: UserPermission;

  @Max(5, {
    message: 'Evaluation max=5',
  })
  @Min(0, {
    message: 'Evaluation min=0',
  })
  @IsNumber()
  @IsOptional()
  @Field((type) => Int, { nullable: true })
  evaluation?: number;

  @IsNumber()
  @IsOptional()
  @Field((type) => Int, { nullable: true })
  equipeId?: number;

  // @IsOptional()
  // @Field(type => ID)
  // equipeId :number;

  // @IsOptional()
  // @Field(type => Equipe, {nullable:true})
  // equipe? :Equipe;

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
