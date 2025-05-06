import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'ZInternalCounters' })
export class InternalCounter extends BaseSchema {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Number, required: false })
  total: number;

  @Prop({ type: String, required: false })
  uri: string;

  @Prop({ type: String, required: false })
  nextUri: string;
}

export type InternalCounterDocument = InternalCounter & Document;
export const InternalCounterSchema = SchemaFactory.createForClass(InternalCounter);
InternalCounterSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...rest } = this.toObject();
  return rest;
};
