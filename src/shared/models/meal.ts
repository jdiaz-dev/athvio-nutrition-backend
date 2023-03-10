import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Ingredient, IngredientSchema } from 'src/shared/models/ingredient';

@ObjectType()
@Schema({ _id: false })
export class Macros {
  @Field()
  @Prop({ type: Number, required: true })
  calories!: number;

  @Field()
  @Prop({ type: Number, required: true })
  protein!: number;

  @Field()
  @Prop({ type: Number, required: true })
  carbs!: number;

  @Field()
  @Prop({ type: Number, required: true })
  fat!: number;
}
const MacroSchema = SchemaFactory.createForClass(Macros);

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class Meal {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: String, required: false })
  tagFood: string; //I don't remember the use case

  @Field()
  @Prop({ type: Number, required: false })
  position: number;

  @Field()
  @Prop({ type: String, required: true })
  recipeName: string;

  @Field(() => [Ingredient])
  @Prop({ type: [IngredientSchema], required: true })
  ingredients: Ingredient[];

  @Field()
  @Prop({ type: String, required: true })
  recipe: string;

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;

  @Field()
  @Prop({ type: MacroSchema, required: true })
  macros: Macros;
}
export const MealSchema = SchemaFactory.createForClass(Meal);
