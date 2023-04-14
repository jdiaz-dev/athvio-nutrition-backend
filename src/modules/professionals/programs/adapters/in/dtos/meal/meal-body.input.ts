import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { IngredientsInput } from 'src/shared/dtos/ingredient-input.dto';
import { MacrosInput } from 'src/shared/dtos/macros-input.dto';

@InputType()
export class MealBodyInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => [IngredientsInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientsInput)
  ingredients: [IngredientsInput];

  @Field()
  @IsString()
  cookingInstruction: string;

  @Field(() => MacrosInput)
  @ValidateNested()
  @Type(() => MacrosInput)
  macros: MacrosInput;
}
