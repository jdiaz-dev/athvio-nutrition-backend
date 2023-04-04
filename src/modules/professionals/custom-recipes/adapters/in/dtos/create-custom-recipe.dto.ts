import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IngredientInput } from 'src/modules/professionals/custom-recipes/adapters/in/dtos/shared';
import { MacrosInput } from 'src/shared/dtos/macros-input.dto';
@InputType()
export class CreateCustomRecipeDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => [IngredientInput], { nullable: false })
  @IsArray()
  @ValidateNested()
  @IsOptional()
  ingredients: IngredientInput[];

  @Field()
  @IsString()
  @IsOptional()
  cookingInstruction: string;

  @Field(() => MacrosInput)
  macros: MacrosInput;
}
