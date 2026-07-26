import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { MealBodyInput } from 'src/shared/adapters/nestjs/dtos/meal-body.input';

@InputType()
export class PlanBodyInput {
  @Field()
  title: string;

  @Field()
  week: number;

  @Field()
  day: number;

  @Field(() => [MealBodyInput])
  @ValidateNested()
  @Type(() => MealBodyInput)
  meals: MealBodyInput[];
}
