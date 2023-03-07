import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ _id: false })
export class Ingredient {
  @Field()
  @Prop({ type: String, required: true })
  name!: boolean;

  @Field()
  @Prop({ type: Number, required: true })
  amount!: number;

  @Field()
  @Prop({ type: String, required: true })
  unit!: number;
}
const IngredientSchema = SchemaFactory.createForClass(Ingredient);

@ObjectType()
@Schema({ timestamps: true })
export class CustomMeal extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userId!: string;

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
