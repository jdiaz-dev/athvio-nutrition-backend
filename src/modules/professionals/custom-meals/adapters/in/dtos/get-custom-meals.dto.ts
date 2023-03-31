import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { CustomMeal } from 'src/modules/professionals/custom-meals/adapters/out/custom-meal.schema';
import { GetRecordsBaseDto } from 'src/shared/dtos/get-records-base.dto';
import { GetRecordsResponse } from 'src/shared/dtos/get-records-response';

@InputType()
export class GetCustomMealsDto extends GetRecordsBaseDto {
  @Field()
  @IsMongoId()
  professional: string;
}

@ObjectType()
export class GetCustomMealsResponse extends GetRecordsResponse {
  @Field(() => [CustomMeal])
  data: CustomMeal[];
}
