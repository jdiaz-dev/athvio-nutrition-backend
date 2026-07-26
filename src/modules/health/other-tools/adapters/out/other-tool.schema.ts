import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/adapters/database/schemas/base.schema';

@ObjectType()
@Schema({ _id: true, timestamps: true, collection: 'OtherTools' })
export class OtherTool extends BaseSchema {
  @Field()
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: Boolean, required: true })
  isActive!: boolean;
}

export type OtherToolDocument = HydratedDocument<OtherTool>;
export const OtherToolSchema = SchemaFactory.createForClass(OtherTool);
OtherToolSchema.methods.toJSON = function (): Partial<OtherTool> {
  const { __v, createdAt, updatedAt, ...otherTool } = this.toObject();
  return otherTool as Partial<OtherTool>;
};
