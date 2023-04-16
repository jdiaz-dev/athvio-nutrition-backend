import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { IngredientInput } from 'src/shared/dtos/ingredient-input.dto';
import { IngredientType } from 'src/shared/enums/project';

@InputType()
class CustomIngredientInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => [IngredientInput], { nullable: true })
  @ValidateNested()
  @IsArray()
  @Type(() => IngredientInput)
  ingredients: IngredientInput[];
}

@InputType()
export class EquivalentsInput {
  @Field()
  @IsEnum(IngredientType)
  ingredientType: IngredientType;

  @Field(() => CustomIngredientInput, { nullable: true })
  @ValidateIf((o) => o.ingredientType === IngredientType.CUSTOM_INGREDIENT, { always: true }) // ValidateIf is not working
  @ValidateNested()
  // @IsNotEmptyObject()
  @Type(() => CustomIngredientInput)
  customIngredient: CustomIngredientInput;

  @Field(() => IngredientInput, { nullable: true })
  @ValidateIf((o) => o.ingredientType === IngredientType.UNIQUE_INGREDIENT, { always: true })
  @ValidateNested()
  // @IsNotEmptyObject()
  @Type(() => IngredientInput)
  ingredient: IngredientInput;
}

@InputType()
export class IngredientDetailInput extends EquivalentsInput {
  @Field(() => [EquivalentsInput])
  @ValidateNested()
  @IsArray()
  @Type(() => EquivalentsInput)
  equivalents: EquivalentsInput[];
}
