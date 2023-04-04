import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetCustomRecipeDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsMongoId()
  customRecipe: string;
}
