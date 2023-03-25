import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@ObjectType()
@Schema({ _id: false })
export class Ingredient {
  @Field()
  @Prop({ type: String, required: true })
  ingredientName!: string;

  @Field()
  @Prop({ type: Number, required: true })
  amount!: number;

  @Field()
  @Prop({ type: String, required: true })
  unit!: string;
}
export const IngredientSchema = SchemaFactory.createForClass(Ingredient);