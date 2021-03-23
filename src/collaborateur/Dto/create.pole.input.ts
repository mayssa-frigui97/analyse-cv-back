import { IsNotEmpty, IsString } from 'class-validator';
import { Field, InputType } from "@nestjs/graphql";

@InputType()//representation mta3 input = dto
export class CreatePoleInput {

    @IsString()
    @IsNotEmpty()
    @Field()
    nom: string;

}

