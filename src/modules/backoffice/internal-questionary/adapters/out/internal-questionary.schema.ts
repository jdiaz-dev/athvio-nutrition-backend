import { ObjectType } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { QuestionaryBase } from 'src/shared/schemas/questionary-base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'InternalQuestionaries' })
export class InternalQuestionary extends QuestionaryBase {}

export type InternalQuestionaryDocument = HydratedDocument<InternalQuestionary>;
export const InternalQuestionarySchema = SchemaFactory.createForClass(InternalQuestionary);
InternalQuestionarySchema.methods.toJSON = function (): Partial<InternalQuestionaryDocument> {
  const { __v, createdAt, updatedAt, ...questionary } = this.toObject();
  return questionary as Partial<InternalQuestionaryDocument>;
};
