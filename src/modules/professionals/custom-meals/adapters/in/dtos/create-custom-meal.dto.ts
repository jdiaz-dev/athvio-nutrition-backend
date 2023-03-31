import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsMongoId, IsOptional, IsString, ValidateNested, IsNumber } from 'class-validator';
import { IngredientInput } from 'src/modules/professionals/custom-meals/adapters/in/dtos/shared';
@InputType()
export class CreateCustomMealDto {
  @Field()
  @IsMongoId()
  professional: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => [IngredientInput], { nullable: false })
  @IsArray()
  @ValidateNested()
  @IsOptional()
  ingredients: IngredientInput[];

  @Field()
  @IsString()
  @IsOptional()
  recipe: string;

  @Field()
  @IsNumber()
  totalProtein!: number;

  @Field()
  @IsNumber()
  totalCarbs!: number;

  @Field()
  @IsNumber()
  totalFat!: number;

  @Field()
  @IsNumber()
  totalCalories!: number;
}
