import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IngredientDetailsInput } from 'src/shared/dtos/ingredient-detail-input';
import { MacrosInput } from 'src/shared/dtos/macros-input.dto';
import { UploadScalar } from 'src/shared/graphql/upload.scalar';

@InputType()
export class CreateNutritionalMealDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => [IngredientDetailsInput], { nullable: false })
  @IsArray()
  @ValidateNested()
  ingredientDetails: IngredientDetailsInput[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  cookingInstructions: string;

  @Field(() => MacrosInput)
  macros: MacrosInput;

  @Field(() => UploadScalar, { nullable: true })
  @IsOptional()
  image?: UploadScalar;
}
