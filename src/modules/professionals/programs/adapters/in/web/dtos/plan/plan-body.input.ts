import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { MealBodyInput } from 'src/modules/professionals/programs/adapters/in/web/dtos/meal/meal-body.input';

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
