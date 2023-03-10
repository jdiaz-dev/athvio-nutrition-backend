import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNumber, IsString } from 'class-validator';
import { IngredientsInput, MacrosInput } from 'src/modules/users/programs/adapters/in/dtos/meal/shared';

@InputType()
export class UpdateMealDto {
  @Field()
  @IsMongoId()
  programId: string;

  @Field()
  @IsMongoId()
  planId: string;

  @Field()
  @IsMongoId()
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
