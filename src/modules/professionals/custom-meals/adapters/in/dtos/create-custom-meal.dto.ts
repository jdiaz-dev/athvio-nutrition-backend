import { Field, InputType } from '@nestjs/graphql';
import { IsArray,    IsMongoId,    IsString } from 'class-validator';
import { IngredientInput } from 'src/modules/professionals/custom-meals/adapters/in/dtos/shared';
@InputType()
export class CreateCustomMealDto {

  @Field()
  @IsMongoId()
  professionalId: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => [IngredientInput], { nullable: false })
  @IsArray()
  ingredients: IngredientInput[];

  @Field()
  @IsString()
  recipe: string;
}
