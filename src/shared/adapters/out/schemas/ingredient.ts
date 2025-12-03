import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Macros } from 'src/shared/adapters/out/schemas/macros';

@ObjectType()
@Schema({ _id: false })
export class Ingredient extends Macros {
  @Field()
  @Prop({ type: String, required: true })
  name: string;

  //string because it must support numbers as 3, 0.45, 1/4, 1/2
  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  amount: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  label: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  internalFood?: string;
}
export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
