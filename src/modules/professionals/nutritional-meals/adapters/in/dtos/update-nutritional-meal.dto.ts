import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsMongoId, IsString, ValidateNested } from 'class-validator';
import { IngredientDetailsInput } from 'src/shared/dtos/ingredient-detail-input';
import { MacrosInput } from 'src/shared/dtos/macros-input.dto';

@InputType()
export class UpdateNutritionalMealDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  nutritionalMeal: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => [IngredientDetailsInput], { nullable: false })
  @IsArray()
  @ValidateNested()
  ingredientDetails: IngredientDetailsInput[];

  @Field()
  @IsString()
  cookingInstructions: string;

  @Field(() => MacrosInput)
  macros: MacrosInput;
}
