import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'NutritionalPreferences' })
export class NutritionalPreference extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  name!: string;
}

export type NutritionalPreferenceDocument = NutritionalPreference & Document;
export const NutritionalPreferenceSchema = SchemaFactory.createForClass(NutritionalPreference);
NutritionalPreferenceSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...nutritionalPreference } = this.toObject();
  return nutritionalPreference;
};
