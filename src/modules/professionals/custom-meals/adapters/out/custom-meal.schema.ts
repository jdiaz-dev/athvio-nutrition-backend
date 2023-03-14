import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { Ingredient, IngredientSchema } from 'src/shared/models/ingredient';

@ObjectType()
@Schema({ timestamps: true, collection: 'CustomMeals' })
export class CustomMeal extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professionalId!: string;

  @Field()
  @Prop({ type: String, required: true })
  name!: string;

  @Field(() => [Ingredient])
  @Prop({ type: [IngredientSchema], required: true })
  ingredients!: Ingredient[];

  @Field()
  @Prop({ type: String, required: true })
  recipe!: string;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type CustomMealDocument = CustomMeal & Document;
export const CustomMealSchema = SchemaFactory.createForClass(CustomMeal);
CustomMealSchema.methods.toJSON = function () {
  let { __v, createdAt, updatedAt, ...customMeal } = this.toObject();
  //   console.log('----------programTag json', programTag);
  return customMeal;
};
