import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateActAssocInput{
    
    @IsDate()
    @IsOptional()
    @Field({nullable:true})
    dateDebut?:Date;

    @IsDate()
    @IsOptional()
    @Field({nullable:true})
    dateFin?:Date;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    association?: string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    poste?: string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    description?:string;

}