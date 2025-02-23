import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'DiseaseCauses' })
export class DiseaseCause extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  name!: string;
}

export type DiseaseCauseDocument = DiseaseCause & Document;
export const DiseaseCauseSchema = SchemaFactory.createForClass(DiseaseCause);
DiseaseCauseSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...diseaseCause } = this.toObject();
  return diseaseCause;
};
