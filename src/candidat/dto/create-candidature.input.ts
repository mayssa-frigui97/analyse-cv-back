/* eslint-disable prettier/prettier */
import { InputType, Int, Field } from '@nestjs/graphql';
import { 
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateCandidatureInput {

  @IsDate()
  @IsNotEmpty()
  @Field()
  date: Date;

  @IsNumber()
  @IsOptional()
  @Field((type) => Int, { nullable: true })
  candidatId?: number;
}
