import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsMongoId } from 'class-validator';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealDatabases } from 'src/modules/professionals/nutritional-meals/helpers/constants';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';

@InputType()
export class GetNutritionalMealsForProfessionalDto extends GetRecordsBaseDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsEnum(NutritionalMealDatabases)
  database: NutritionalMealDatabases;
}

@ObjectType()
export class GetNutritionalMealsResponse extends GetRecordsResponse {
  @Field(() => [NutritionalMeal])
  data: NutritionalMeal[];
}
