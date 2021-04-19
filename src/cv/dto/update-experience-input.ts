import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateExperienceInput{
    @IsDate()
    @IsOptional()
    @Field({nullable:true})
    dateDebut?: Date;

    @IsDate()
    @IsOptional()
    @Field({nullable:true})
    dateFin?: Date;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    societe?:string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    poste?:string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    description?:string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    motCles?:string;
}