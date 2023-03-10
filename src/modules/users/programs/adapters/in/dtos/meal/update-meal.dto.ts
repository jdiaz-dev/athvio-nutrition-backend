import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { IngredientsInput, MacrosInput } from 'src/modules/users/programs/adapters/in/dtos/meal/shared';

@InputType()
export class UpdateMealDto {
  @Field()
  @IsString()
  programId: string;

  @Field()
  @IsString()
  planId: string;

  @Field()
  @IsString()
  mealId: string;

  @Field()
  @IsNumber()
  position: number;

  @Field()
  @IsString()
  recipeName: string;

  @Field(() => [IngredientsInput])
  ingredients: [IngredientsInput];

  @Field()
  @IsString()
  recipe: string;

  @Field(() => MacrosInput)
  macros: MacrosInput;
}
