import { Candidat } from './../../candidat/entities/candidat.entity';
import { CreateCvInput } from './create-cv.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { StatutCV } from 'src/enum/StatutCV';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateCvInput extends PartialType(CreateCvInput) {
    @IsString()
    @IsOptional()
    @Field({nullable:true})
    cmptLinkedin?:string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    cmptGithub?:string;

    @IsOptional()
    @Field({nullable:true})
    statutCV: StatutCV;

    // @IsOptional()
    // @Field(type => Candidat,{nullable:true})
    // candidat? :Candidat;
}