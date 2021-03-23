import { CreateNotificationInput } from './create-notification.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsDate, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateNotificationInput extends PartialType(CreateNotificationInput) {
    @IsDate()
    @IsOptional()
    @Field({nullable:true})
    date?:Date;
    
    @IsString()
    @IsOptional()
    // @Transform(value => new Date(value))
    @Field({nullable:true})
    description?:string;
}
