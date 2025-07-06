import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'ProgramTags' })
export class ProgramTag extends BaseSchema {
  @Field()
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professional!: string;

  @Field()
  @Prop({ type: String, required: true })
  title!: string;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type ProgramTagDocument = HydratedDocument<ProgramTag>;
export const ProgramTagSchema = SchemaFactory.createForClass(ProgramTag);
ProgramTagSchema.methods.toJSON = function (): Partial<ProgramTag> {
  const { __v, createdAt, updatedAt, ...programTag } = this.toObject();
  return programTag as Partial<ProgramTag>;
};
