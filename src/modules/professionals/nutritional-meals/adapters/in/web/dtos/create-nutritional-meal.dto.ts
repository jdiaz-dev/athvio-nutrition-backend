import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsUUID, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IngredientDetailsInput } from 'src/shared/adapters/in/dtos/ingredient-detail-input';
import { MacrosInput } from 'src/shared/adapters/in/dtos/macros-input.dto';
import { UploadScalar } from 'src/shared/adapters/in/graphql/upload.scalar';

@InputType()
export class CreateNutritionalMealDto {
  @Field()
  @IsUUID(4)
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
