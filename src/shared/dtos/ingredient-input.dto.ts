import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class IngredientsInput {
  @Field()
  @IsNumber()
  amount: number;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  unit: string;

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
