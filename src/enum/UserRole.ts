import { registerEnumType } from "@nestjs/graphql";

export enum UserRole {
    RH = 'RH',
    RP = 'RP',
    TEAMLEADER = 'TEAMLEADER',
    COLLABORATEUR ='COLLABORATEUR'
  }

  registerEnumType(UserRole, {name:'UserRole',});