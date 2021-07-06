/* eslint-disable prettier/prettier */
import { UserRole } from './../../enum/UserRole';
import { Field, Int, InputType } from '@nestjs/graphql';
import {
  IsAlpha,
  IsAlphanumeric,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
} from 'class-validator';
import { UpdateEquipeInput } from './update-equipe.input';
import { UpdatePersonneInput } from '../../candidat/dto/update-personne.input';
import { Index } from 'typeorm';

@InputType() //representation mta3 input = dto
export class UpdateColInput extends UpdatePersonneInput {
  @IsNumber()
  @Index({ unique: true })
  @IsOptional()
  @Field((type) => Int, { nullable: true })
  cin?: number;

  @IsOptional()
  @IsInt()
  @Field((type) => Int, { nullable: true })
  telPro?: number;

  @IsOptional()
  @IsEmail()
  @Field({ nullable: true })
  emailPro?: string;

  @IsString()
  @IsOptional()
  @IsAlpha()
  @Field({ nullable: true })
  poste?: string;

  @IsNumber()
  @IsOptional()
  @Field((type) => Int, { nullable: true })
  salaire?: number;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  dateEmb?: Date;

  @MaxLength(20, {
    message: 'Nom utilisateur is too long',
  })
  @IsAlphanumeric()
  @IsOptional()
  @Field({ nullable: true })
  nomUtilisateur?: string;

  @IsOptional()
  @Field((type) => UserRole, { nullable: true })
  role?: UserRole;

  @MaxLength(5, {
    message: 'Evaluation max=5',
  })
  @MinLength(0, {
    message: 'Evaluation min=0',
  })
  @IsNumber()
  @IsOptional()
  @Field((type) => Int, { nullable: true })
  evaluation?: number;

  @IsOptional()
  @Field((type) => Int, { nullable: true })
  equipeId?: number;

  // @IsOptional()
  // @Field(type => Equipe, equipe => equipe.collaborateurs,{nullable:true})
  // equipe? :Equipe;
}
