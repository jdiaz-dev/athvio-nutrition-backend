import { Field, InputType } from '@nestjs/graphql';
import { IsArray,    IsString } from 'class-validator';
import { IngredientInput } from 'src/modules/users/custom-meals/adapters/in/dtos/shared';
@InputType()
export class CreateCustomMealDto {
  @Field()
  @IsString()
  name: string;

  @Field(() => [IngredientInput], { nullable: false })
  @IsArray()
  ingredients: IngredientInput[];

  @Field()
  @IsString()
  recipe: string;
}
