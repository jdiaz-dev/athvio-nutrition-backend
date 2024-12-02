import { Field, InputType } from '@nestjs/graphql';
import { MealBodyInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal/meal-body.input';

@InputType()
export class PlanBodyInput {
  @Field()
  title: string;

  @Field()
  week: number;

  @Field()
  day: number;

  @Field(() => [MealBodyInput])
  meals: MealBodyInput[];
}
