import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';
import { MealInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-plan-meal.dto';

@InputType()
export class CreateClientPlanDto {
  @Field()
  @IsMongoId()
  clientId: string;

  @Field()
  @IsDate()
  assignedDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title: string;

  @Field(() => [MealInput], { nullable: true })
  @IsOptional()
  planMeals: [MealInput];
}
