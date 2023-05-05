import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { ProgramTag } from 'src/modules/professionals/program-tags/adapters/out/program-tag.schema';
import { Meal, MealSchema } from 'src/shared/models/meal-plan';
import { Client } from 'src/modules/clients/clients/adapters/out/client.schema';

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class Plan {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: String, required: true, default: '' })
  title!: string;

  @Field()
  @Prop({ type: Number, required: true })
  week!: number;

  @Field()
  @Prop({ type: Number, required: true })
  day!: number;

  @Field(() => [Meal])
  @Prop({ type: [MealSchema], required: true, default: [] })
  meals!: Meal[];

  //planWorkouts: any;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;
}
const PlanSchema = SchemaFactory.createForClass(Plan);

@ObjectType()
@Schema({ timestamps: true, collection: 'Programs' })
export class Program extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professional!: string;

  @Field()
  @Prop({ type: String, required: true })
  name!: string;

  @Field()
  @Prop({ type: String, required: false })
  description!: string;

  @Field(() => [ProgramTag])
  @Prop({ type: [String], required: true, default: [], ref: ProgramTag.name })
  programTags: ProgramTag[];

  @Field(() => [Plan])
  @Prop({ type: [PlanSchema], required: false })
  plans!: Plan[];

  @Field(() => [Client])
  @Prop({ type: [String], required: true, default: [], ref: Client.name })
  clients: Client[];

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type ProgramDocument = Program & Document;
export const ProgramSchema = SchemaFactory.createForClass(Program);
ProgramSchema.methods.toJSON = function (): Partial<Program> {
  const { __v, createdAt, updatedAt, ...program } = this.toObject();
  //   console.log('----------program json', program);
  return program as Partial<Program>;
};
