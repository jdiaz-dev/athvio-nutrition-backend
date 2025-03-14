import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeleteNutritionalMealDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  nutritionalMeal: string;
}
