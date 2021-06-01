  
import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateCompetenceInput{
    
    @IsString()
    @IsOptional()
    @Field({nullable:true})
    nom?: string;

    @IsInt()
    @IsOptional()
    @Field(type => Int,{nullable:true})
    version?:number;
}