import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { Meal, MealSchema } from 'src/shared/schemas/meal-plan';
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
@Schema({ _id: true, timestamps: true, collection: 'PatientPlans' })
export class PatientPlan extends BaseSchema {
  @Field()
  @Prop({ type: String, required: true })
  patient!: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  title!: string;

  @Field(() => Date)
  @Prop({ type: Date, required: true })
  assignedDate!: Date;

  @Field(() => [Meal], { nullable: true })
  @Prop({ type: [MealSchema], required: true, default: [] })
  meals!: Meal[];
  /*
    after extends from MealPlan, add the next properties
    userInteraction:{
      isAccomplish: boolean
      likeStatus: boolean,
      imageLikeStatus: string,
      comments: Comment[]
    }

  */

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
  isDeleted!: boolean;
}

export type PatientPlanDocument = HydratedDocument<PatientPlan>;
export const PatientPlanSchema = SchemaFactory.createForClass(PatientPlan);
PatientPlanSchema.methods.toJSON = function (): Partial<PatientPlan> {
  const { __v, createdAt, updatedAt, ...patientPlan } = this.toObject();
  return patientPlan as Partial<PatientPlan>;
};
