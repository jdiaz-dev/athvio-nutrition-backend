import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Option,
  OptionType,
  QuestionaryBase,
  QuestionaryDetailCommonBase,
  QuestionaryGroupBase,
} from 'src/shared/adapters/database/schemas/questionary-base.schema';
import { QuestionaryAnswer, QuestionaryAnswerScalar } from 'src/shared/adapters/nestjs/graphql/questionary-answer.scalar';

@Schema({ _id: true, timestamps: false })
@ObjectType()
export class PatientQuestionaryDetail extends QuestionaryDetailCommonBase {
  @Prop({ type: String, required: false })
  professionalQuestionaryDetail?: string;

  @Field(() => [Option], { nullable: true })
  options?: Option[];

  @Field(() => String, { nullable: true })
  optionType: OptionType;

  @Field(() => QuestionaryAnswerScalar, { nullable: true })
  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  answer?: QuestionaryAnswer;

  @Field(() => String)
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

export type PatientQuestionaryDocument = HydratedDocument<PatientQuestionary>;
export const PatientQuestionarySchema = SchemaFactory.createForClass(PatientQuestionary);
PatientQuestionarySchema.methods.toJSON = function (): Partial<PatientQuestionary> {
  const { __v, createdAt, updatedAt, ...patientQuestionary } = this.toObject();
  return patientQuestionary as Partial<PatientQuestionary>;
};
