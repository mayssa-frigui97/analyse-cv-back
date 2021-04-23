import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
 export class LoginDto {  

    @Field()
    @IsNotEmpty()  
    readonly NomUtilisateur: string;

    @Field()
    @IsNotEmpty()  
    readonly motDePasse: string;
}