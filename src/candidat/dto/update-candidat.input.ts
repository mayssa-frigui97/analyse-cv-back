import { IsInt, IsOptional, IsBoolean } from 'class-validator';
import { InputType, Field} from '@nestjs/graphql';
import { UpdatePersonneInput } from './update-personne.input';

@InputType()
export class UpdateCandidatInput extends UpdatePersonneInput{
    
    @IsOptional()
    @IsBoolean()
    @Field(type => Boolean,{nullable:true})
    recommande?: boolean;
}
