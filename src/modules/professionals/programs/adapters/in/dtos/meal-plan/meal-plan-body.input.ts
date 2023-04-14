import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class MealPlanBodyInput {
  @Field()
  @IsString()
  mealTag: string;

  @Field()
  @IsNumber()
  @IsOptional()
  position: number;
}
