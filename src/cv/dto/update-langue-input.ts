import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";

@InputType()
export class UpdateLangueInput {
  
    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    nom?: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    niveau?: string;

    @IsBoolean()
    @IsOptional()
    @Field({ nullable: true })
    certifie: boolean;
}