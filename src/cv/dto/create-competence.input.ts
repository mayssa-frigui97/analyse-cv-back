import { Field, InputType, Int } from "@nestjs/graphql";
import { IsAlpha, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateCompetenceInput{
    
    @IsAlpha()
    @IsNotEmpty()
    @Field()
    nom: string;

    @IsInt()
    @IsOptional()
    @Field(type => Int,{nullable:true})
    version?:number;

}