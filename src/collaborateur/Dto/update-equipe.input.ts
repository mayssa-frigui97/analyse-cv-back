/* eslint-disable prettier/prettier */
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsEmail } from 'class-validator';
import { UpdatePoleInput } from './update-pole.input';

@InputType() //representation mta3 input = dto
export class UpdateEquipeInput {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  nom?: string;

  @IsOptional()
  @IsEmail()
  @Field(() => UpdatePoleInput, { nullable: true })
  pole?: UpdatePoleInput;

  @IsOptional()
  @Field((type) => Int,{ nullable: true })
  teamleader?: number;
}
