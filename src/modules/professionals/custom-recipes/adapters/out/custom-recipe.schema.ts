import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { IngredientDetail, IngredientDetailSchema, Macros, MacroSchema } from 'src/shared/models/meal-plan';

@ObjectType()
@Schema({ timestamps: true, collection: 'CustomRecipes' })
export class CustomRecipe extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professional!: string;

  @Field()
  @Prop({ type: String, required: true })
  name!: string;

  @Field(() => [IngredientDetail])
  @Prop({ type: [IngredientDetailSchema], required: true })
  ingredientDetails: IngredientDetail[];

  @Field()
  @Prop({ type: String, required: false })
  cookingInstructions!: string;

  @Field()
  @Prop({ type: Number, required: true })
  totalWeight: number;

  @Field()
  @Prop({ type: MacroSchema, required: true })
  macros: Macros;

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type CustomRecipeDocument = CustomRecipe & Document;
export const CustomRecipeSchema = SchemaFactory.createForClass(CustomRecipe);
CustomRecipeSchema.methods.toJSON = function () {
  let { __v, createdAt, updatedAt, ...customMeal } = this.toObject();
  //   console.log('----------programTag json', programTag);
  return customMeal;
};
