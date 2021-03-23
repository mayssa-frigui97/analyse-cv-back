import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateNotificationInput {
    @IsDate()
    @IsNotEmpty()
    @Field()
    date:Date;
    
    @IsString()
    @IsNotEmpty()
    @Field()
    description:string;

    @IsBoolean()
    @Field({defaultValue:false})
    lu:boolean;
}
