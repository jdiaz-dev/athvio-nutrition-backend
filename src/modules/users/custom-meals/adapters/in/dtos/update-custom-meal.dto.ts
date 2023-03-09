import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';
import { IngredientInput } from 'src/modules/users/custom-meals/adapters/in/dtos/shared';

@InputType()
export class UpdateCustomMealDto {
  @Field()
  @IsString()
  _id: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => [IngredientInput])
  @IsArray()
  ingredients: IngredientInput[];

  @Field()
  @IsString()
  recipe: string;
}
