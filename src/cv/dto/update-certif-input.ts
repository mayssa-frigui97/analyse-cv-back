import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateCertifInput{
    @IsDate()
    @IsOptional()
    @Field({nullable:true})
    dateObtention?:Date;

    @IsDate()
    @IsOptional()
    @Field({nullable:true})
    dateExpiration?:Date;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    nom?: string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    niveau?: string;
}
