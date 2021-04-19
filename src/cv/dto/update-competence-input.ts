import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateCompetenceInput{
    
    @IsString()
    @IsOptional()
    @Field({nullable:true})
    nom?: string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    version?:string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    niveau?: string;
}