import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { QuestionaryBase, QuestionaryDetailBase, QuestionaryGroupBase } from 'src/shared/schemas/questionary-base.schema';

@Schema({ _id: true, timestamps: false })
@ObjectType()
class PatientQuestionaryDetail extends QuestionaryDetailBase {
  @Field(() => String)
  @Prop({ type: String, required: false, default: '' })
  answer?: string;

  @Prop({ type: String, required: false, default: '' })
  additionalNotes?: string;
}
const PatientQuestionaryDetailSchema = SchemaFactory.createForClass(PatientQuestionaryDetail);

@ObjectType()
@Schema({ _id: true, timestamps: false })
export class PatientQuestionaryGroup extends QuestionaryGroupBase {
  @Field(() => [PatientQuestionaryDetail])
  @Prop({ type: [PatientQuestionaryDetailSchema], required: true })
  questionaryDetails!: PatientQuestionaryDetail[];
}
const PatientQuestionaryGroupSchema = SchemaFactory.createForClass(PatientQuestionaryGroup);

@ObjectType()
@Schema({ timestamps: true, collection: 'PatientQuestionaries' })
export class PatientQuestionary extends QuestionaryBase {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  patient!: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  professional!: string;

  @Field(() => [PatientQuestionaryGroup])
  @Prop({ type: [PatientQuestionaryGroupSchema], required: true })
  questionaryGroups!: PatientQuestionaryGroup[];
}

export type PatientQuestionaryDocument = PatientQuestionary & Document;
export const PatientQuestionarySchema = SchemaFactory.createForClass(PatientQuestionary);
PatientQuestionarySchema.methods.toJSON = function (): Partial<PatientQuestionary> {
  const { __v, createdAt, updatedAt, ...patientQuestionary } = this.toObject();
  return patientQuestionary as Partial<PatientQuestionary>;
};
