import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/adapters/out/schemas/base.schema';

@ObjectType()
@Schema({ _id: true, timestamps: true, collection: 'Notes' })
export class Note extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: String, required: true })
  professional!: string;

  @Field()
  @Prop({ type: String, required: true })
  patient!: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: true })
  content!: string;

  @Field()
  @Prop({ type: Date, required: true })
  date: Date;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: boolean;
}

export type NoteDocument = HydratedDocument<Note>;
export const NoteSchema = SchemaFactory.createForClass(Note);
NoteSchema.methods.toJSON = function (): Partial<Note> {
  const { __v, createdAt, updatedAt, ...patientPlan } = this.toObject();
  return patientPlan as Partial<Note>;
};
