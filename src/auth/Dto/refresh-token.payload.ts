/* eslint-disable prettier/prettier */
import { Field, ObjectType } from '@nestjs/graphql';
import { Collaborateur } from './../../collaborateur/entities/collaborateur.entity';

@ObjectType()
export class RefreshTokenPayload {
  @Field(() => Collaborateur)
  user: Collaborateur;

  @Field()
  accessToken: string;
}
