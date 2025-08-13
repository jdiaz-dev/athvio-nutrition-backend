import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealDatabases } from 'src/modules/professionals/nutritional-meals/helpers/constants';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';
import { SupportedLanguages } from 'src/shared/enums/project';

@InputType()
export class GetNutritionalMealsForProfessionalDto extends GetRecordsBaseDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field(() => String)
  @IsEnum(NutritionalMealDatabases)
  database: NutritionalMealDatabases;

  @Field(() => String)
  @IsEnum(SupportedLanguages)
  language: SupportedLanguages;
}

@ObjectType()
export class GetNutritionalMealsResponse extends GetRecordsResponse {
  @Field(() => [NutritionalMeal])
  data: NutritionalMeal[];
}
