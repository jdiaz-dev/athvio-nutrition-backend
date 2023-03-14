import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsMongoId, IsArray, ValidateNested } from 'class-validator';
import { MealInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-plan-meal.dto';

@InputType()
export class AddProgramPlanDto {
  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @IsMongoId()
  programId: string;

  @Field()
  @IsNumber()
  week: number;

  @Field()
  @IsNumber()
  day: number;

  @Field(() => [MealInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealInput)
  planMeals: [MealInput];
}
