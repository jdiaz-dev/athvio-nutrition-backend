import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { QuestionaryBase, QuestionaryDetailSchema } from 'src/shared/schemas/questionary-base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'QuestionaryConfigs' })
export class QuestionaryConfig extends QuestionaryBase {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professional!: string;
}

export type QuestionaryConfigDocument = QuestionaryConfig & Document;
export const QuestionaryConfigSchema = SchemaFactory.createForClass(QuestionaryConfig);
QuestionaryConfigSchema.methods.toJSON = function (): Partial<QuestionaryConfig> {
  const { __v, createdAt, updatedAt, ...questionaryConfig } = this.toObject();
  return questionaryConfig as Partial<QuestionaryConfig>;
};
QuestionaryConfigSchema.path('questionaryGroups', {
  schemaForQuestionaryGroups: QuestionaryDetailSchema,
});
