/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType() //representation mta3 input = dto
export class CreateEquipeInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  nom: string;
}
