import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  protein!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  carbs!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  fat!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  calories!: number;
}
