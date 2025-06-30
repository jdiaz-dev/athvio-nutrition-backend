import { ObjectType } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { QuestionaryBase } from 'src/shared/schemas/questionary-base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'Questionaries' })
export class Questionary extends QuestionaryBase {}

export type QuestionaryDocument = HydratedDocument<Questionary>;
export const QuestionarySchema = SchemaFactory.createForClass(Questionary);
QuestionarySchema.methods.toJSON = function (): Partial<QuestionaryDocument> {
  const { __v, createdAt, updatedAt, ...questionary } = this.toObject();
  return questionary as Partial<QuestionaryDocument>;
};
