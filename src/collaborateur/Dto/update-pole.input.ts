import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()//representation mta3 input = dto
export class UpdatePoleInput {

    @IsOptional()
    @IsString()
    @Field({nullable:true})
    nom?: string;

    // @IsOptional()
    // @Field(type => UpdatePersonneInput,{nullable:true})
    // rp? :UpdatePersonneInput;

}