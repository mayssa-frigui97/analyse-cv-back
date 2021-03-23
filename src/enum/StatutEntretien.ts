import { registerEnumType } from "@nestjs/graphql";

export enum StatutEntretien {
    PLANIFIE= 'PLANIFIE',
    REPORTE = 'REPORTE',
    ANNULE = 'ANNULE',
    EFFECTUE = 'EFFECTUE'
  }

  registerEnumType(StatutEntretien, {name:'StatutEntretien',});