import { registerEnumType } from "@nestjs/graphql";

export enum UserRole {
    ADMIN= 'ADMIN',
    RH = 'RH',
    RP = 'RP',
    TEAMLEADER = 'TEAMLEADER',
    COLABORATEUR ='COLABORATEUR'
  }

  registerEnumType(UserRole, {name:'UserRole',});