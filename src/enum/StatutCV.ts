/* eslint-disable prettier/prettier */
import { registerEnumType } from '@nestjs/graphql';

export enum StatutCV {
  RECU = 'RECU',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
}

registerEnumType(StatutCV, { name: 'StatutCV' });
