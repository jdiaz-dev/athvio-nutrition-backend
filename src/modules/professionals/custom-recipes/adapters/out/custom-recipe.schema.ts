import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { Ingredient, IngredientSchema } from 'src/shared/models/ingredient';
import { Macros, MacroSchema } from 'src/shared/models/meal-plan';

@ObjectType()
@Schema({ timestamps: true, collection: 'CustomRecipes' })
export class CustomRecipe extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professional!: string;

  @Field()
  @Prop({ type: String, required: true })
  name!: string;

  @Field(() => [Ingredient])
  @Prop({ type: [IngredientSchema], required: false })
  ingredients!: Ingredient[];

  @Field()
  @Prop({ type: String, required: false })
  cookingInstruction!: string;

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
