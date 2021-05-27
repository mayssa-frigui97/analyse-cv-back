import { IsAlpha, IsBoolean, IsDate, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { CreatePersonneInput } from './create-personne.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { UpdateCvInput } from 'src/cv/dto/update-cv.input';

@InputType()
export class UpdatePersonneInput extends PartialType(CreatePersonneInput) {

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    nom:string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    etatCivil?:string;

    @IsDate()
    @IsOptional()
    @Field({nullable:true})
    dateNaiss?: Date;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    adresse?: string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    tel?: string;

    @IsOptional()
    @Field({nullable:true})
    @IsEmail()
    email: string;

    @IsOptional()
    @Field({nullable:true})
    avatar?: string;

    @IsOptional()
    @IsBoolean()
    @Field(type => Boolean,{nullable:true})
    recommande?: boolean;

    @IsOptional()
    @Field(type => UpdateCvInput,{nullable:true})
    cv? :UpdateCvInput;
}
