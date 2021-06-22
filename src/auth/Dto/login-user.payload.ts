/* eslint-disable prettier/prettier */
import { ObjectType, Field } from "@nestjs/graphql";
import { Collaborateur } from "./../../collaborateur/entities/collaborateur.entity";

@ObjectType()
export class LoginUserPayload {
  @Field()
  public access_token: string;
  @Field()
  public refresh_token: string;
  @Field((type) => Collaborateur, {nullable: true})
  public user?: Collaborateur;
}