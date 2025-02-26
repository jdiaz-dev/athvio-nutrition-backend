import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Macros } from 'src/shared/models/macros';

@ObjectType()
@Schema({ _id: false })
export class Ingredient extends Macros {
  @Field()
  @Prop({ type: String, required: true })
  name: string;

  @Field({ nullable: true })
  @Prop({ type: Number, required: false })
  amount: number;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  label: string;
}
export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
