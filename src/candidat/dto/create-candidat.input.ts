import { InputType, Field } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsBoolean } from 'class-validator';
import { CreatePersonneInput } from './create-personne.input';

@InputType()
export class CreateCandidatInput extends CreatePersonneInput{

    @IsNotEmpty()
    @IsBoolean()
    @Field(type => Boolean)
    recommande: boolean;
}