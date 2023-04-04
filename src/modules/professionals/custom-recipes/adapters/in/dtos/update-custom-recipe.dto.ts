import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsMongoId, IsString } from 'class-validator';
import { IngredientInput } from 'src/modules/professionals/custom-recipes/adapters/in/dtos/shared';
import { MacrosInput } from 'src/shared/dtos/macros-input.dto';

@InputType()
export class UpdateCustomRecipeDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  customRecipe: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => [IngredientInput])
  @IsArray()
  ingredients: IngredientInput[];

  @Field()
  @IsString()
  cookingInstruction: string;

  @Field(() => MacrosInput)
  macros: MacrosInput;
}
