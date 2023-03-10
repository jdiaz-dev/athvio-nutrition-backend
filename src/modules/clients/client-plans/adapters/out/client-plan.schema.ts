import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { Meal, MealSchema } from 'src/shared/models/meal';
import { PlanState } from 'src/shared/enums/project';

@ObjectType()
@Schema()
export class Commenter extends BaseSchema {
  @Field()
  @Prop({ type: String, required: true })
  commenterId!: string;

  @Field()
  @Prop({ type: String, required: true })
  type!: string;
}
const CommenterSchema = SchemaFactory.createForClass(Commenter);

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class Comment extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: CommenterSchema, required: true })
  commenter!: Commenter;

  @Field()
  @Prop({ type: String, required: true })
  message: string;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}
const CommentSchema = SchemaFactory.createForClass(Comment);

@ObjectType()
@Schema({ _id: true, timestamps: true, collection: 'ClientPlans' })
export class ClientPlan extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: String, required: true })
  clientId!: string;

  @Field()
  @Prop({ type: String, required: false })
  title!: string;

  @Field(() => ID)
  @Prop({ type: Date, required: true })
  assignedDate!: Date;

  @Field(() => [Meal])
  @Prop({ type: [MealSchema], required: true, default: [] })
  planMeals!: Meal[];

  // planWorkouts!: any[];

  @Field(() => [Comment])
  @Prop({ type: [CommentSchema], required: true, default: [] })
  comments: Comment[];

  @Field()
  @Prop({ type: String, required: false })
  commentResult: string;

  @Field()
  @Prop({ type: String, enum: PlanState, required: true, default: PlanState.UPCOMING })
  state: PlanState;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type ClientPlanDocument = ClientPlan & Document;
export const ClientPlanSchema = SchemaFactory.createForClass(ClientPlan);
ClientPlanSchema.methods.toJSON = function () {
  let { __v, createdAt, updatedAt, ...clientGroup } = this.toObject();
  //   console.log('----------clientGroup json', clientGroup);
  return clientGroup;
};
