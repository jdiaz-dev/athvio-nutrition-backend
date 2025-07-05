import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MealBodyInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal/meal-body.input';

@InputType()
export class UpdateMealDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  program: string;

  @Field()
  @IsUUID()
  plan: string;

  @Field(() => [MealBodyInput])
  @ValidateNested()
  @Type(() => MealBodyInput)
  meals: MealBodyInput[];
}
