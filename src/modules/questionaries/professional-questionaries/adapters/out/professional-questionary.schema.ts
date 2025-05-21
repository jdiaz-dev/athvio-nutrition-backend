import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { QuestionaryBase, QuestionaryDetailBase, QuestionaryGroupBase } from 'src/shared/schemas/questionary-base.schema';

@Schema({ _id: true, timestamps: false })
@ObjectType()
class ProfessionalQuestionaryDetail extends QuestionaryDetailBase {}
const ProfessionalQuestionaryDetailSchema = SchemaFactory.createForClass(ProfessionalQuestionaryDetail);

@ObjectType()
@Schema({ _id: true, timestamps: false })
class ProfessionalQuestionaryGroup extends QuestionaryGroupBase {
  @Field(() => [ProfessionalQuestionaryDetail])
  @Prop({ type: [ProfessionalQuestionaryDetailSchema], required: true })
  questionaryDetails!: ProfessionalQuestionaryDetail[];
}
const ProfessionalQuestionaryGroupSchema = SchemaFactory.createForClass(ProfessionalQuestionaryGroup);

@ObjectType()
@Schema({ timestamps: true, collection: 'ProfessionalQuestionaries' })
export class ProfessionalQuestionary extends QuestionaryBase {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professional!: string;

  @Field(() => [ProfessionalQuestionaryGroup])
  @Prop({ type: [ProfessionalQuestionaryGroupSchema], required: true })
  questionaryGroups!: ProfessionalQuestionaryGroup[];
}

export type ProfessionalQuestionaryDocument = ProfessionalQuestionary & Document;
export const ProfessionalQuestionarySchema = SchemaFactory.createForClass(ProfessionalQuestionary);
ProfessionalQuestionarySchema.methods.toJSON = function (): Partial<ProfessionalQuestionary> {
  const { __v, createdAt, updatedAt, ...professionalQuestionary } = this.toObject();
  return professionalQuestionary as Partial<ProfessionalQuestionary>;
};
