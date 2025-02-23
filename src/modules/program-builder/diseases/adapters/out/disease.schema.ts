import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'Diseases' })
export class Disease extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: [String], required: true, default: [] })
  prompts!: string[];

  /* 
    healthProtocol
  */
}

export type DiseaseDocument = Disease & Document;
export const DiseaseSchema = SchemaFactory.createForClass(Disease);
DiseaseSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...disease } = this.toObject();
  return disease;
};
