import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

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
