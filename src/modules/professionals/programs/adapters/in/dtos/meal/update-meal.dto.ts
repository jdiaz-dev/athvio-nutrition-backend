import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNumber, IsString } from 'class-validator';
import { IngredientsInput } from 'src/shared/dtos/ingredient-input.dto';
import { MacrosInput } from 'src/shared/dtos/macros-input.dto';

@InputType()
export class UpdateMealDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  program: string;

  @Field()
  @IsMongoId()
  plan: string;

  @Field()
  @IsMongoId()
  meal: string;

  @Field()
  @IsNumber()
  position: number;

  @Field()
  @IsString()
  recipeName: string;

  @Field(() => [IngredientsInput])
  ingredients: [IngredientsInput];

  @Field()
  @IsString()
  recipe: string;

  @Field(() => MacrosInput)
  macros: MacrosInput;
}
