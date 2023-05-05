import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MealBodyInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal/meal-body.input';

@InputType()
export class UpdateMealDto {
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
  meal: string;

  @Field()
  @ValidateNested()
  @Type(() => MealBodyInput)
  mealBody: MealBodyInput;
}
