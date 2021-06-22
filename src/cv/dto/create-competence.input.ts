/* eslint-disable prettier/prettier */
import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsAlpha,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateCompetenceInput {
  @IsAlpha()
  @IsNotEmpty()
  @Field()
  nom: string;
}
