import { registerEnumType } from "@nestjs/graphql";

export enum UserPermission {
    SUPER = 'SUPER',
    ADMINISTRATEUR = 'ADMINISTRATEUR',
    UTILISATEUR = 'UTILISATEUR'
  }

  registerEnumType(UserPermission, {name:'UserPermission'});