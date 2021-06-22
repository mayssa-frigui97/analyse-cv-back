import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InputType, Int, Field } from '@nestjs/graphql';
import { CreateCompetenceInput } from './create-competence.input';
import { StatutCV } from './../../enum/StatutCV';

@InputType()
export class CreateCvInput {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  cmptLinkedin?: string;

  @IsNotEmpty()
  @Field()
  statutCV: StatutCV;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  activiteAssociatives?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  certificats?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  experiences?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  formations?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  projets?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  interets?: string;

  // @IsOptional()
  // @Field(type => [String],{nullable:true})
  // competences?:string[];

  @IsOptional()
  @Field((type) => [String], { nullable: true })
  langues?: string[];

  @IsOptional()
  @Field((type) => [CreateCompetenceInput], { nullable: true })
  competences?: CreateCompetenceInput[];
}
