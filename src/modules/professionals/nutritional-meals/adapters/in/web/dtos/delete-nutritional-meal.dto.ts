import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteNutritionalMealDto {
  @Field()
  @IsUUID()
  professional: string;

  @Field()
  @IsUUID()
  nutritionalMeal: string;
}
