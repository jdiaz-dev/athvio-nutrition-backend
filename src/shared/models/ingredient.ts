import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({ _id: false })
export class Ingredient {
  @Field()
  @Prop({ type: String, required: true })
  name!: string;

  @Field()
  @Prop({ type: Number, required: true })
  amount!: number;

  @Field()
  @Prop({ type: String, required: true })
  unit!: string;

  @Field({ nullable: true })
  @Prop({ type: Number, required: false })
  protein!: number;

  @Field({ nullable: true })
  @Prop({ type: Number, required: false })
  carbs!: number;

  @Field({ nullable: true })
  @Prop({ type: Number, required: false })
  fat!: number;

  @Field({ nullable: true })
  @Prop({ type: Number, required: false })
  calories!: number;
}
export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
