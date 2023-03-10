import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsMongoId, IsString } from 'class-validator';
import { IngredientInput } from 'src/modules/users/custom-meals/adapters/in/dtos/shared';

@InputType()
export class UpdateCustomMealDto {
  @Field()
  @IsMongoId()
  customMealId: string;

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
