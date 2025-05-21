import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { QuestionaryBase, QuestionaryDetailBase, QuestionaryGroupBase } from 'src/shared/schemas/questionary-base.schema';

@Schema({ _id: true, timestamps: false })
@ObjectType()
class ProfessionalQuestionaryDetail extends QuestionaryDetailBase {}
const ProfessionalQuestionarySchema = SchemaFactory.createForClass(ProfessionalQuestionaryDetail);

@ObjectType()
@Schema({ _id: true, timestamps: false })
class ProfessionalQuestionaryGroup extends QuestionaryGroupBase {
  @Field(() => [ProfessionalQuestionaryDetail])
  @Prop({ type: [ProfessionalQuestionarySchema], required: true })
  questionaryDetails!: ProfessionalQuestionaryDetail[];
}
const ProfessionalQuestionaryGroupSchema = SchemaFactory.createForClass(ProfessionalQuestionaryGroup);

@ObjectType()
@Schema({ timestamps: true, collection: 'QuestionaryConfigs' })
export class QuestionaryConfig extends QuestionaryBase {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professional!: string;

  @Field(() => [ProfessionalQuestionaryGroup])
  @Prop({ type: [ProfessionalQuestionaryGroupSchema], required: true })
  questionaryGroups!: ProfessionalQuestionaryGroup[];
}

export type QuestionaryConfigDocument = QuestionaryConfig & Document;
export const QuestionaryConfigSchema = SchemaFactory.createForClass(QuestionaryConfig);
QuestionaryConfigSchema.methods.toJSON = function (): Partial<QuestionaryConfig> {
  const { __v, createdAt, updatedAt, ...questionaryConfig } = this.toObject();
  return questionaryConfig as Partial<QuestionaryConfig>;
};
