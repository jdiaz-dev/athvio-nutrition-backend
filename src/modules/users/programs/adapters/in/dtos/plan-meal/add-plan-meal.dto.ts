import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class MacrosInput {
  @Field()
  @IsNumber()
  protein: number;

  @Field()
  @IsNumber()
  fat: number;

  @Field()
  @IsNumber()
  carbs: number;

  @Field()
  @IsNumber()
  calories: number;
}

@InputType()
export class IngredientsInput {
  @Field()
  @IsNumber()
  amount: number;

  @Field()
  @IsString()
  ingredient: string;

  @Field()
  @IsString()
  unit: string;
}

@InputType()
export class AddPlanMealDto {
  @Field()
  @IsString()
  programId: string;

  @Field()
  @IsString()
  planId: string;

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
