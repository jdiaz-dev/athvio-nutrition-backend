import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested, IsOptional } from 'class-validator';
import { IngredientDetailsInput } from 'src/shared/adapters/in/dtos/ingredient-detail-input';
import { MacrosInput } from 'src/shared/adapters/in/dtos/macros-input.dto';
import { UploadScalar } from 'src/shared/adapters/in/graphql/upload.scalar';

@InputType()
export class MealBodyInput {
  @Field({ nullable: true })
  @IsOptional()
  meal?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  position: number;

  @Field()
  @IsString()
  mealTag: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => UploadScalar || String, { nullable: true })
  @IsOptional()
  image?: UploadScalar | string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  imageSource?: string;

  @Field(() => [IngredientDetailsInput], { nullable: false })
  @IsArray()
  @ValidateNested()
  ingredientDetails: IngredientDetailsInput[];

  @Field()
  @IsString()
  cookingInstructions: string;

  @Field(() => MacrosInput)
  @ValidateNested()
  @Type(() => MacrosInput)
  macros: MacrosInput;
}
