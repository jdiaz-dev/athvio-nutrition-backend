import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IngredientInput } from 'src/modules/professionals/custom-recipes/adapters/in/dtos/shared';
import { MacrosInput } from 'src/shared/dtos/macros-input.dto';

/*
@ObjectType()
@Schema({ _id: false })
export class IngredientDetail {
  @Field()
  @Prop({ type: String, enum: IngredientType, required: true })
  type: IngredientType;

  @Field({ nullable: true })
  @Prop({ type: [IngredientSchema], required: false })
  customIngredient: Ingredient[];

  @Field({ nullable: true })
  @Prop({ type: IngredientSchema, required: false })
  ingredient: Ingredient;

  @Field(() => [IngredientDetail])
  //the reason of this type is self nested schema
  @Prop({ type: [SchemaFactory.createForClass(IngredientDetail)], required: true, default: [] })
  equivalents: IngredientDetail[];
}
export const IngredientDetailSchema = SchemaFactory.createForClass(IngredientDetail);

*/

export class

@InputType()
export class CreateCustomRecipeDto {
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
  cookingInstruction: string;

  @Field(() => MacrosInput)
  macros: MacrosInput;
}
