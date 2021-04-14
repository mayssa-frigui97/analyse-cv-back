import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InputType, Int, Field } from '@nestjs/graphql';
import { StatutCV } from 'src/enum/StatutCV';

@InputType()
export class CreateCvInput {

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    cmptLinkedin?:string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    cmptGithub?:string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    posteAct?:string;

    @IsString()
    @IsOptional()
    @Field({nullable:true})
    description?:string;

    @IsNotEmpty()
    @Field()
    statutCV: StatutCV;

    // @IsNotEmpty()
    // @Field(type => Candidat)
    // candidat :Candidat;
}
