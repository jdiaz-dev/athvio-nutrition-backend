import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { IngredientDetail, IngredientDetailSchema } from 'src/shared/models/meal-plan';
import { Macros, MacroSchema } from 'src/shared/models/macros';

@ObjectType()
@Schema({ timestamps: true, collection: 'Meals' })
export class NutritionalMeal extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professional!: string;

  @Field()
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => [IngredientDetail])
  @Prop({ type: [IngredientDetailSchema], required: true })
  ingredientDetails: IngredientDetail[];

  @Field()
  @Prop({ type: String, required: false })
  cookingInstructions!: string;

  @Field()
  @Prop({ type: MacroSchema, required: true })
  macros: Macros;

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type NutritionalDocument = NutritionalMeal & Document;
export const NutritionalMealSchema = SchemaFactory.createForClass(NutritionalMeal);
NutritionalMealSchema.methods.toJSON = function (): Partial<NutritionalMeal> {
  const { __v, createdAt, updatedAt, ...nutritionalMeal } = this.toObject();
  return nutritionalMeal as Partial<NutritionalMeal>;
};
