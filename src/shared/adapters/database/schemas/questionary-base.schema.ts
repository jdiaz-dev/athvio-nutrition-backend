import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/adapters/database/schemas/base.schema';

export enum OptionType {
  MULTIPLE_SELECTOR = 'multiple_selector',
  TEXT = 'text',
  SELECTOR = 'selector',
  BOOLEAN = 'boolean',
  HOUR = 'hour',
}

@Schema({ _id: true, timestamps: false })
@ObjectType()
export class FocusedQuestionOption {
  @Field()
  @Prop({ type: String, required: true })
  uuid: string;

  @Field()
  @Prop({ type: String, required: true })
  name: string;
}
const FocusedQuestionOptionSchema = SchemaFactory.createForClass(FocusedQuestionOption);

@Schema({ _id: true, timestamps: false })
@ObjectType()
export class FocusedQuestion {
  @Field(() => String)
  @Prop({ type: String, required: true })
  uuid: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  fieldName: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  associatedQuestion: string;

  @Field(() => String)
  @Prop({ type: String, enum: OptionType, required: true })
  optionType: OptionType;

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: true })
  isEnabled: boolean;

  @Field(() => [FocusedQuestionOption], { nullable: true })
  @Prop({ type: [FocusedQuestionOptionSchema], required: false, default: undefined })
  options?: FocusedQuestionOption[];
}
const FocusedQuestionSchema = SchemaFactory.createForClass(FocusedQuestion);

@Schema({ _id: true, timestamps: false })
@ObjectType()
export class Option {
  @Field()
  @Prop({ type: String, required: true })
  uuid: string;

  @Field()
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => [FocusedQuestion], { nullable: true })
  @Prop({ type: [FocusedQuestionSchema], required: false, default: undefined })
  focusedQuestions?: FocusedQuestion[];
}
const OptionSchema = SchemaFactory.createForClass(Option);

@Schema({ _id: true, timestamps: false })
@ObjectType({ isAbstract: true })
export class QuestionaryDetailCommonBase {
  _id?: string;

  @Field()
  @Prop({ type: String, required: true })
  uuid: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  fieldName: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  associatedQuestion: string;

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: true })
  isEnabled: boolean;

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;
}

@Schema({ _id: true, timestamps: false })
@ObjectType()
export class QuestionaryDetailBase extends QuestionaryDetailCommonBase {
  @Field(() => [Option], { nullable: true })
  @Prop({ type: [OptionSchema], required: false })
  options?: Option[];

  @Field(() => String)
  @Prop({ type: String, enum: OptionType, required: true })
  optionType: OptionType;
}
const QuestionaryDetailBaseSchema = SchemaFactory.createForClass(QuestionaryDetailBase);

@ObjectType()
@Schema({ _id: true, timestamps: false })
export class QuestionaryGroupBase {
  _id?: string;

  @Field()
  @Prop({ type: String, required: true })
  uuid: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  title!: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  description?: string;

  @Field(() => [QuestionaryDetailBase])
  @Prop({ type: [QuestionaryDetailBaseSchema], required: true })
  questionaryDetails!: QuestionaryDetailBase[];
}
const QuestionaryGroupBaseSchema = SchemaFactory.createForClass(QuestionaryGroupBase);

@ObjectType()
export class QuestionaryBase extends BaseSchema {
  @Field(() => [QuestionaryGroupBase])
  @Prop({ type: [QuestionaryGroupBaseSchema], required: true })
  questionaryGroups!: QuestionaryGroupBase[];
}
