import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()//representation mta3 input = dto
export class FilterInput {

    @IsNotEmpty()
    @IsString()
    @Field()
    champs: string;

    @IsNotEmpty()
    @Field(type => [Int])
    valeurs: number[];

}