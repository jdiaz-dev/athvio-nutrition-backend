import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { IngredientDetailInput } from 'src/shared/dtos/ingredient-detail-input';
import { MacrosInput } from 'src/shared/dtos/macros-input.dto';

@InputType()
export class MealBodyInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => IngredientDetailInput, { nullable: false })
  @IsArray()
  @ValidateNested()
  ingredientDetail: IngredientDetailInput;

  @Field()
  @IsString()
  cookingInstruction: string;

  @Field(() => MacrosInput)
  @ValidateNested()
  @Type(() => MacrosInput)
  macros: MacrosInput;
}
