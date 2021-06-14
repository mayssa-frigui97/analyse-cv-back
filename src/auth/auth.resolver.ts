import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Any } from 'typeorm';
import { CollaborateurService } from './../collaborateur/collaborateur.service';
import { Collaborateur } from './../collaborateur/entities/collaborateur.entity';
import { CurrentUser } from '../decorators/user.decorator';
import { authGuard } from './Guards/auth.guard';
import { AuthService, Connexion } from './auth.service';
import { GraphQLError } from 'graphql';
import { JwtAuthGuard } from './Guards/jwt.auth.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private collaborateurService: CollaborateurService,
    private authService: AuthService,
  ) {}

  @Query(() => Connexion)
  async login(
    @Args('nomUtilisateur') nomUtilisateur: string,
    @Args('motDePasse') motDePasse: string,
  ) {
    return this.authService.login({ nomUtilisateur, motDePasse });
  }

  @Mutation(() => Boolean)
  async addUserLdap(
    @Args('nomUtilisateur') nomUtilisateur: string,
    @Args('motDePasse') motDePasse: string,
  ) {
    return this.authService.addUser({ nomUtilisateur, motDePasse });
  }

  // @Mutation(() => Connexion)
  // async addUserLdap(
  //   @Args('nomUtilisateur') nomUtilisateur: string),
  //   @Args('motDePasse') motDePasse: string))
  //   {
  //   try {
  //     return await this.authService.login({ nomUtilisateur, motDePasse });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // @Query((returns) => Collaborateur)
  // // @UseGuards(authGuard)
  // getUserAuth(@CurrentUser() user: Collaborateur) {
  //   console.log(user);
  //   return this.collaborateurService.findColByUsername(user.nomUtilisateur);
  // }
}
