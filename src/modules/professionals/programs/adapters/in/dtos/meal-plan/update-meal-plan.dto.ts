import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MealPlanBodyInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal-plan/meal-plan-body.input';

@InputType()
export class UpdateMealPlanDto {
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
  @IsMongoId()
  mealPlan: string;

  @Field()
  @ValidateNested()
  @Type(() => MealPlanBodyInput)
  mealPlanBody: MealPlanBodyInput;
}
