import { registerEnumType } from "@nestjs/graphql";

export enum UserRole {
    ADMIN= 'ADMIN',
    RH = 'RH',
    RP = 'RP',
    TEAMLEADER = 'TEAMLEADER',
    COLLABORATEUR ='COLLABORATEUR'
  }

  registerEnumType(UserRole, {name:'UserRole',});