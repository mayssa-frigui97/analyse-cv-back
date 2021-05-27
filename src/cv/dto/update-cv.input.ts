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

    @IsOptional()
    @Field({nullable:true})
    statutCV: StatutCV;

    @IsOptional()
    @IsString()
    @Field({nullable:true})
    activiteAssociatives?: string;

    @IsOptional()
    @IsString()
    @Field({nullable:true})
    certificats?: string;
    
    @IsOptional()
    @IsString()
    @Field({nullable:true})
    experiences?: string;
    
    @IsOptional()
    @IsString()
    @Field({nullable:true})
    formations?: string;
    
    @IsOptional()
    @IsString()
    @Field({nullable:true})
    projets?: string;
    
    @IsOptional()
    @IsString()
    @Field({nullable:true})
    interets?: string;

    @IsOptional()
    @IsString()
    @Field(type => [String],{nullable:true})
    competences?:string[];

    @IsOptional()
    @IsString()
    @Field(type => [String],{nullable:true})
    langues?: string[];

}
