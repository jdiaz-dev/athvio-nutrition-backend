import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, IsString, ValidateNested } from 'class-validator';
import { IngredientsInput, MacrosInput } from 'src/modules/professionals/programs/adapters/in/dtos/meal/shared';

@InputType()
export class MealInput {
  @Field()
  @IsString()
  recipeName: string;

  @Field(() => [IngredientsInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientsInput)
  ingredients: [IngredientsInput];

  @Field()
  @IsString()
  recipe: string;

  @Field(() => MacrosInput)
  @ValidateNested()
  @Type(() => MacrosInput)
  macros: MacrosInput;
}
@InputType()
export class AddPlanMealDto extends MealInput {
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
  @IsNumber()
  position: number;
}
