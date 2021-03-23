import { IsAlpha, IsDate, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { CreateCandidatInput } from './create-candidat.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCandidatInput extends PartialType(CreateCandidatInput) {
    @IsOptional()
    @IsInt()
    @Field(type => Int,{nullable:true})
    cin: number;

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
}
