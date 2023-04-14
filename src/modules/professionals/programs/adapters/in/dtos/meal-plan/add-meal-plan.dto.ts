import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsMongoId, ValidateNested } from 'class-validator';
import { MealPlanBodyInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal-plan/meal-plan-body.input';

@InputType()
export class AddMealPlanDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  program: string;

  @Field()
  @IsMongoId()
  plan: string;

  @Field()
  @ValidateNested()
  @Type(() => MealPlanBodyInput)
  mealPlanBody: MealPlanBodyInput;
}
