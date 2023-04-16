import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IngredientType } from 'src/shared/enums/project';
import { Ingredient, IngredientSchema } from 'src/shared/models/ingredient';

@ObjectType()
@Schema({ _id: false })
export class Macros {
  @Field()
  @Prop({ type: Number, required: true })
  protein!: number;

  @Field()
  @Prop({ type: Number, required: true })
  carbs!: number;

  @Field()
  @Prop({ type: Number, required: true })
  fat!: number;

  @Field()
  @Prop({ type: Number, required: true })
  calories!: number;
}
export const MacroSchema = SchemaFactory.createForClass(Macros);

@ObjectType()
@Schema({ _id: false })
class CustomIngredient {
  @Field()
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => [Ingredient], { nullable: true })
  @Prop({ type: [IngredientSchema], required: false, isRequired: false })
  ingredients: Ingredient[];
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
registerEnumType(IngredientType, { name: 'IngredientType' });
const EquivalentSchema = SchemaFactory.createForClass(Equivalent);

@ObjectType()
@Schema({ _id: false })
export class IngredientDetail extends Equivalent {
  @Field(() => [Equivalent])
  @Prop({ type: [EquivalentSchema], required: true, default: [] })
  equivalents: Equivalent[];
}

export const IngredientDetailSchema = SchemaFactory.createForClass(IngredientDetail);

@ObjectType()
@Schema({ _id: true, timestamps: true })
class Meal {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => [IngredientDetail])
  @Prop({ type: [IngredientDetailSchema], required: true })
  ingredientDetail: IngredientDetail[];

  @Field()
  @Prop({ type: String, required: false })
  cookingInstruction: string;

  @Field()
  @Prop({ type: MacroSchema, required: true })
  macros: Macros;

  //micros

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;
}
const MealSchema = SchemaFactory.createForClass(Meal);

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class MealPlan {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: String, required: false })
  mealTag: string; //Example breakfast, luch or dinner, emal1

  @Field()
  @Prop({ type: Number, required: false })
  position: number;

  @Field(() => [Meal])
  @Prop({ type: [MealSchema], required: true, default: [] })
  meals: Meal[];

  @Field()
  @Prop({ type: MacroSchema, required: true })
  macros: Macros;

  //micros

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;
}
export const MealPlanSchema = SchemaFactory.createForClass(MealPlan);
