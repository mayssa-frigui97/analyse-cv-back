import { registerEnumType } from "@nestjs/graphql";

export enum UserPermission {
    SUPER = 'SUPER',
    ADMINISTRATEUR = 'ADMINISTRATEUR',
    VISITEUR = 'VISITEUR',
    UTILISATEUR = 'UTILISATEUR'
  }

  registerEnumType(UserPermission, {name:'UserPermission'});