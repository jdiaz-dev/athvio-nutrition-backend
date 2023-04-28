import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({ _id: false })
export class Macros {
  @Field()
  @Prop({ type: Number, required: true })
  weightInGrams!: number;

  @Field()
  @Prop({ type: Number, required: true })
  protein!: number;

  @Field()
  @Prop({ type: Number, required: true })
  carbs!: number;

  @Field()
  @Prop({ type: Number, required: true })
  fat!: number;

  @Field()
  @Prop({ type: Number, required: true })
  calories!: number;
}
export const MacroSchema = SchemaFactory.createForClass(Macros);
