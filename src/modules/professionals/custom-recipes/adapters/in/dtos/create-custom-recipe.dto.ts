import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IngredientDetailInput } from 'src/shared/dtos/ingredient-detail-input';
import { MacrosInput } from 'src/shared/dtos/macros-input.dto';

@InputType()
export class CreateCustomRecipeDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => [IngredientDetailInput], { nullable: false })
  @IsArray()
  @ValidateNested()
  ingredientDetails: IngredientDetailInput[];

  @Field()
  @IsString()
  @IsOptional()
  cookingInstructions: string;

  @Field()
  @IsNumber()
  totalWeight: number;

  @Field(() => MacrosInput)
  macros: MacrosInput;
}
