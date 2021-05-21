import { InputType, Int, Field } from '@nestjs/graphql';
import { IsAlpha, IsDate, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Cv } from '../../cv/entities/cv.entity';

@InputType()
export class CreatePersonneInput {

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

    @IsNumber()
    @IsOptional()
    @Field(type => Int)
    cvId? :number;
}