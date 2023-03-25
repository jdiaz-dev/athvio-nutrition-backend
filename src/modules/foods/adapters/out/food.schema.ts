import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'Foods' })
export class Food extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: String, required: true })
  name!: string;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type FoodDocument = Food & Document;
export const FoodSchema = SchemaFactory.createForClass(Food);
FoodSchema.methods.toJSON = function () {
  let { __v, createdAt, updatedAt, ...rest } = this.toObject();
  //   console.log('----------rest json', rest);
  return rest;
};
