import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsArray, ArrayNotEmpty, ValidateNested, IsNumber } from 'class-validator';

@InputType()
export class FoodInput {
  @Field()
  @IsUUID(4)
  internalFood: string;

  @Field()
  @IsNumber()
  amountInGrams: number;
}

@InputType()
export class CalculateFoodsNutrientsDto {
  @Field(() => [FoodInput])
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  internalFoods: FoodInput[];
}
