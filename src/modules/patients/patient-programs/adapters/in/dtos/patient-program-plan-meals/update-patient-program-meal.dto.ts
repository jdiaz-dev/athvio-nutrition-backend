import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MealBodyInput } from 'src/shared/adapters/in/dtos/meal-body.input';

@InputType()
export class UpdatePatientProgramMealDto {
  @Field()
  @IsUUID(4)
  patient: string;

  @Field()
  @IsUUID(4)
  patientProgram: string;

  @Field()
  @IsUUID(4)
  plan: string;

  @Field(() => [MealBodyInput])
  @ValidateNested()
  @Type(() => MealBodyInput)
  meals: MealBodyInput[];
}
