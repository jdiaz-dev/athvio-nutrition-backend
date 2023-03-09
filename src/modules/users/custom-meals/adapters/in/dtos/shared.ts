import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class IngredientInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsNumber()
  amount: number;

  @Field()
  @IsString()
  unit: string;
}
