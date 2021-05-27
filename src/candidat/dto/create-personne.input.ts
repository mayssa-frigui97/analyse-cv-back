import { InputType, Int, Field } from '@nestjs/graphql';
import { IsAlpha, IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Cv } from '../../cv/entities/cv.entity';

@InputType()
export class CreatePersonneInput {

    @IsString()
    @IsNotEmpty()
    @Field()
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
    @IsNotEmpty()
    @Field({nullable:true})
    tel?: string;

    @IsNotEmpty()
    @Field()
    @IsEmail()
    email: string;

    @IsOptional()
    @Field({nullable:true})
    avatar?: string;

    @IsNotEmpty()
    @IsBoolean()
    @Field(type => Boolean,{nullable:true})
    recommande?: boolean;

    @IsNumber()
    @IsOptional()
    @Field(type => Int)
    cvId? :number;
}