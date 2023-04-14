import { Field, ID, ObjectType } from '@nestjs/graphql';
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

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class Meal {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => IngredientDetail)
  @Prop({ type: IngredientDetailSchema, required: true })
  ingredientDetail: IngredientDetail;

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
export const MealSchema = SchemaFactory.createForClass(Meal);

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
