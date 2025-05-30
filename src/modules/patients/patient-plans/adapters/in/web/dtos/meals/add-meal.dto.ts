import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsMongoId, ValidateNested } from 'class-validator';
import { MealBodyInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal/meal-body.input';

@InputType()
export class AddPlanMealDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  patient: string;

  @Field()
  @IsMongoId()
  patientPlan: string;

  @Field(() => [MealBodyInput])
  @ValidateNested()
  @Type(() => MealBodyInput)
  meals: MealBodyInput[];
}
