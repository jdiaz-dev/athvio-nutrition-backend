import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';
import { MealBodyInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal/meal-body.input';
import { Meal } from 'src/shared/models/meal-plan';

@InputType()
export class CreatePatientPlanDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  patient: string;

  @Field()
  @IsDate()
  assignedDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title: string;

  @Field(() => [MealBodyInput], { nullable: true })
  @IsOptional()
  meals: [Meal] | [MealBodyInput];
}
