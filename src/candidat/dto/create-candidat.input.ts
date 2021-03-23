import { InputType, Int, Field } from '@nestjs/graphql';
import { IsAlpha, IsDate, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCandidatInput {
    @IsOptional()
    @IsInt()
    @Field(type => Int,{nullable:true})
    cin: number;

    @IsString()
    @IsNotEmpty()
    @IsAlpha()
    @Field()
    prenom:string;

    @IsString()
    @IsNotEmpty()
    @Field()
    nom:string;

    @IsDate()
    @IsNotEmpty()
    @Field()
    dateNaiss: Date;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    adresse?: string;

    @IsInt()
    @IsNotEmpty()
    @Field(type => Int)
    tel: number;

    @IsNotEmpty()
    @Field()
    @IsEmail()
    email: string;

    @IsOptional()
    @Field({nullable:true})
    avatar?: string;
}