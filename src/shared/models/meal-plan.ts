import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IngredientType } from 'src/shared/enums/project';
import { Ingredient, IngredientSchema } from 'src/shared/models/ingredient';
import { Macros, MacroSchema } from 'src/shared/models/macros';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ _id: false })
class CustomIngredient {
  @Field()
  @Prop({ type: Number, required: true })
  amount: number;

  @Field()
  @Prop({ type: String, required: true })
  label: string;

  @Field()
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => [Ingredient], { nullable: true })
  @Prop({ type: [IngredientSchema], required: false })
  ingredients: Ingredient[];

  @Field(() => Macros)
  @Prop({ type: MacroSchema, required: true })
  macros: Macros;
}
const CustomIngredientSchema = SchemaFactory.createForClass(CustomIngredient);

@ObjectType()
@Schema({ _id: false })
class Equivalent {
  @Field(() => IngredientType)
  @Prop({ type: String, enum: IngredientType, required: true })
  ingredientType: IngredientType; //ingredient type will be specified in the fronted side due that it will know that api called

  @Field(() => CustomIngredient, { nullable: true })
  @Prop({ type: CustomIngredientSchema, required: false, isRequired: false })
  customIngredient: CustomIngredient;

  @Field(() => Ingredient, { nullable: true })
  @Prop({ type: IngredientSchema, required: false, isRequired: false })
  ingredient: Ingredient;
}
registerEnumType(IngredientType, {
  name: 'IngredientType',
  valuesMap: {
    CUSTOM_INGREDIENT: {
      description: 'custom ingredient',
    },
    UNIQUE_INGREDIENT: {
      description: 'unique ingredient',
    },
  },
});
const EquivalentSchema = SchemaFactory.createForClass(Equivalent);

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class IngredientDetail extends Equivalent {
  @Field(() => [Equivalent])
  @Prop({ type: [EquivalentSchema], required: true, default: [] })
  equivalents: Equivalent[];
}

export const IngredientDetailSchema = SchemaFactory.createForClass(IngredientDetail);

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class Meal extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: Number, required: false })
  position: number;

  @Field()
  @Prop({ type: String, required: false })
  mealTag: string; //Example breakfast, luch or dinner, emal1

  //todo: remove name? only use mealTag?
  @Field()
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => [IngredientDetail])
  @Prop({ type: [IngredientDetailSchema], required: true })
  ingredientDetails: IngredientDetail[];

  @Field()
  @Prop({ type: String, required: false })
  cookingInstructions: string;

  @Field()
  @Prop({ type: MacroSchema, required: true })
  macros: Macros;

  //micros

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;
}
export const MealSchema = SchemaFactory.createForClass(Meal);
