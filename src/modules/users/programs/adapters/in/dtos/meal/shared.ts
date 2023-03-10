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
  ingredientName: string;

  @Field()
  @IsString()
  unit: string;
}
