import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateFormationInput{
    
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
    universite?:string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    specialite?:string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    niveau?: string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    mention?:string;
}