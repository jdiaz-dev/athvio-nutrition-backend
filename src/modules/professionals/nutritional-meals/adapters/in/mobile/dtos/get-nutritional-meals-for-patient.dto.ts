import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';

@InputType()
export class GetNutritionalMealsForPatientDto extends GetRecordsBaseDto {
  @Field()
  @IsMongoId()
  patient: string;
}

@ObjectType()
export class GetNutritionalMealsResponse extends GetRecordsResponse {
  @Field(() => [NutritionalMeal])
  data: NutritionalMeal[];
}
