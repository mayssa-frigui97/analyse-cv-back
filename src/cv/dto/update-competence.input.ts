/* eslint-disable prettier/prettier */
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateCompetenceInput {
    
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  nom?: string;
}
