import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@ObjectType()
class Ingredient {
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

@InputType()
export class UpdateCustomMealDto {
  @Field()
  @IsString()
  _id: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => [Ingredient])
  @IsString()
  ingredients: Ingredient[];

  @Field()
  @IsString()
  recipe: string;
}
