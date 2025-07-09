import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@Schema({ _id: true, timestamps: false })
@ObjectType()
export class QuestionaryDetailBase {
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

  @Field(() => [String])
  @Prop({ type: [String], required: false })
  options?: string[];

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: true })
  isEnabled: boolean;

  @Field(() => Boolean)
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;
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
