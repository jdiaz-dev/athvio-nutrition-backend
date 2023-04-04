import { Field, InputType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

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
