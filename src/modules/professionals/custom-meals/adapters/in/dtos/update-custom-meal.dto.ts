import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsMongoId, IsNumber, IsString } from 'class-validator';
import { IngredientInput } from 'src/modules/professionals/custom-meals/adapters/in/dtos/shared';

@InputType()
export class UpdateCustomMealDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  customMeal: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => [IngredientInput])
  @IsArray()
  ingredients: IngredientInput[];

  @Field()
  @IsString()
  recipe: string;

  @Field()
  @IsNumber()
  totalProtein!: number;

  @Field()
  @IsNumber()
  totalCarbs!: number;

  @Field()
  @IsNumber()
  totalFat!: number;

  @Field()
  @IsNumber()
  totalCalories!: number;
}
