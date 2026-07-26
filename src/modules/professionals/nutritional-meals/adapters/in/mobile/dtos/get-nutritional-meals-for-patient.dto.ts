import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealCategories } from 'src/modules/professionals/nutritional-meals/helpers/constants';
import { GetRecordsBaseDto } from 'src/shared/adapters/in/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/adapters/in/dtos/get-records-response';

@InputType()
export class GetNutritionalMealsForPatientDto extends GetRecordsBaseDto {
  @Field()
  @IsUUID(4)
  patient: string;

  @Field(() => String)
  @IsEnum(NutritionalMealCategories)
  category: NutritionalMealCategories;
}

@ObjectType()
export class GetNutritionalMealsResponse extends GetRecordsResponse {
  @Field(() => [NutritionalMeal])
  data: NutritionalMeal[];
}
