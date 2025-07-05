import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';
import { MealBodyInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal/meal-body.input';

@InputType()
export class AddPlanMealDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsUUID(4)
  patientPlan: string;

  @Field(() => [MealBodyInput])
  @ValidateNested()
  @Type(() => MealBodyInput)
  meals: MealBodyInput[];
}
