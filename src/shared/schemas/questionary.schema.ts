import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@Schema({ _id: true, timestamps: false })
@ObjectType()
export class QuestionaryDetail {
  @Field(() => ID)
  //todo: remove optional
  _id?: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  fieldName: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  associatedQuestion: string;

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: true })
  enabled: boolean;

  @Field(() => String)
  @Prop({ type: String, required: true })
  fieldType: string;

  @Field(() => String || [String], { nullable: true })
  @Prop({ type: String || [String], required: false })
  fieldOptions?: string | string[];
}
const QuestionaryDetailSchema = SchemaFactory.createForClass(QuestionaryDetail);

@ObjectType()
@Schema({ _id: true, timestamps: false })
export class QuestionaryGroup {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  title!: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  description!: string;

  @Field(() => [QuestionaryDetail])
  @Prop({ type: [QuestionaryDetailSchema], required: true })
  questionaryDetails!: QuestionaryDetail[];
}
const QuestionaryGroupSchema = SchemaFactory.createForClass(QuestionaryGroup);

@ObjectType()
export class Questionary extends BaseSchema {
  @Field(() => ID)
  _id: string;

  @Field(() => [QuestionaryGroup])
  @Prop({ type: [QuestionaryGroupSchema], required: true })
  questionaryGroups!: QuestionaryGroup[];
}
