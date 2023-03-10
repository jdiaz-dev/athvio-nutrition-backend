import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';
import { MealInput } from 'src/modules/users/programs/adapters/in/dtos/meal/add-plan-meal.dto';

@InputType()
export class UpdateClientPlanDto {
  @Field()
  @IsMongoId()
  clientId: string;

  @Field()
  @IsMongoId()
  clientPlanId: string;

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
