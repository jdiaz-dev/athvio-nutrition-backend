import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'ProgramTags' })
export class ProgramTag extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professional!: string;

  @Field()
  @Prop({ type: String, required: true })
  title!: string;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type ProgramTagDocument = ProgramTag & Document;
export const ProgramTagSchema = SchemaFactory.createForClass(ProgramTag);
ProgramTagSchema.methods.toJSON = function (): Partial<ProgramTag> {
  const { __v, createdAt, updatedAt, ...programTag } = this.toObject();
  //   console.log('----------programTag json', programTag);
  return programTag as Partial<ProgramTag>;
};
