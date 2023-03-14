import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class IngredientInput {
  @Field()
  @IsString()
  ingredientName: string;

  @Field()
  @IsNumber()
  amount: number;

  @Field()
  @IsString()
  unit: string;
}
