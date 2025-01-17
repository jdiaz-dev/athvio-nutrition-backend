import { ObjectType } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QuestionaryBase } from 'src/shared/schemas/questionary-base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'Questionaries' })
export class Questionary extends QuestionaryBase {}

export type QuestionaryDocument = Questionary & Document;
export const QuestionarySchema = SchemaFactory.createForClass(Questionary);
QuestionarySchema.methods.toJSON = function (): Partial<QuestionaryDocument> {
  const { __v, createdAt, updatedAt, ...questionary } = this.toObject();
  return questionary as Partial<QuestionaryDocument>;
};
