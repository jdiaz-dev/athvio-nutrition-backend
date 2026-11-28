import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BodyMassIndexResult {
  @Field(() => Float, { description: 'IMC calculado (kg/m²)' })
  bodyMassIndex: number;

  @Field({ description: 'Clasificación, ej. Normal, Sobrepeso' })
  classification: string;

  @Field({ description: 'Tabla usada para clasificar, ej. Niños y adolescentes (OMS)' })
  source: string;

  @Field({ description: 'Rango de la tabla en el que cae el paciente' })
  rangeLabel: string;

  @Field(() => Float, { nullable: true, description: 'Puntaje Z de IMC para la edad (solo niños y adolescentes 5–19 años)' })
  zScore?: number;

  @Field(() => Float, { nullable: true, description: 'Ganancia de peso total mínima recomendada (gestantes)' })
  weightGainMinKg?: number;

  @Field(() => Float, { nullable: true, description: 'Ganancia de peso total máxima recomendada (gestantes)' })
  weightGainMaxKg?: number;
}
