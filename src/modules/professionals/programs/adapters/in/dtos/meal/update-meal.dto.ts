import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MealBodyInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal/meal-body.input';

@InputType()
export class UpdateMealDto {
  @Field()
  @IsUUID(4)
  professional: string;

  @Field()
  @IsUUID(4)
  program: string;

  @Field()
  @IsUUID(4)
  plan: string;

  @Field(() => [MealBodyInput])
  @ValidateNested()
  @Type(() => MealBodyInput)
  meals: MealBodyInput[];
}
