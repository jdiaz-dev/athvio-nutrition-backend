import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
// import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: true, timestamps: false })
@ObjectType()
export class PatientQuestionaryDetail {
  @Field(() => ID)
  _id?: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  fieldName: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  associatedQuestion: string;

  @Prop({ type: String, required: true })
  fieldType: string;

  @Prop({ type: String || [String], required: false })
  fieldOptions?: string | string[];

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: true })
  isEnabled: boolean;

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;
}
const PatientQuestionaryDetailSchema = SchemaFactory.createForClass(PatientQuestionaryDetail);

@Schema({ _id: true, timestamps: false })
@ObjectType()
export class QuestionaryDetail {
  @Field(() => ID)
  _id?: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  fieldName: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  associatedQuestion: string;

  @Prop({ type: String, required: true })
  fieldType: string;

  @Prop({ type: String || [String], required: false })
  fieldOptions?: string | string[];

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: true })
  isEnabled: boolean;

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;
}
export const QuestionaryDetailSchema = SchemaFactory.createForClass(QuestionaryDetail);

@ObjectType()
@Schema({ _id: true, timestamps: false })
export class QuestionaryGroup {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  title!: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  description?: string;

  @Field(() => [QuestionaryDetail])
  @Prop({
    type: (context: unknown) => {
      console.log('-------context', context);
      PatientQuestionaryDetailSchema
      return QuestionaryDetailSchema; // or PatientQuestionaryDetailSchema
    },
    required: true,
  })
  questionaryDetails!: QuestionaryDetail[];
}
const QuestionaryGroupSchema = SchemaFactory.createForClass(QuestionaryGroup);

@ObjectType()
export class QuestionaryBase extends BaseSchema {
  @Field(() => [QuestionaryGroup])
  @Prop({
    type: [QuestionaryGroupSchema],
    required: true,
  })
  questionaryGroups!: QuestionaryGroup[];
}

/* @ObjectType()
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
QuestionaryConfigSchema.path( 'questionaryGroups', {
  
}) */
