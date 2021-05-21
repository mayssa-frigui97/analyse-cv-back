import { IsAlpha, IsDate, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { CreatePersonneInput } from './create-personne.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { UpdateCvInput } from 'src/cv/dto/update-cv.input';

@InputType()
export class UpdatePersonneInput extends PartialType(CreatePersonneInput) {
    @IsString()
    @IsAlpha()
    @IsOptional()
    @Field({nullable:true})
    prenom:string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    nom:string;

    @IsDate()
    @IsOptional()
    @Field({nullable:true})
    dateNaiss: Date;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    adresse?: string;

    @IsInt()
    @IsOptional()
    @Field(type => Int,{nullable:true})
    tel: number;

    @IsOptional()
    @Field({nullable:true})
    @IsEmail()
    email: string;

    @IsOptional()
    @Field({nullable:true})
    avatar?: string;

    @IsOptional()
    @Field(type => UpdateCvInput,{nullable:true})
    cv? :UpdateCvInput;
}
