import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { ProgramTag } from 'src/modules/professionals/program-tags/adapters/out/program-tag.schema';
import { Meal, MealSchema } from 'src/shared/schemas/meal-plan';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { EnumSources, SupportedLanguages } from 'src/shared/enums/project';

@Schema({ _id: false, timestamps: false })
export class PlanDetail {
  @Prop({ type: Boolean, required: true, default: false })
  isDuplicate: boolean;

  @Prop({ type: String, required: false })
  source: string;
}
const PlanDetailSchema = SchemaFactory.createForClass(PlanDetail);

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class Plan extends BaseSchema {
  @Field()
  @Prop({ type: String, required: false, default: '' })
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

  @Prop({ type: PlanDetailSchema, required: true, default: {} })
  planDetail: PlanDetail;
}
const PlanSchema = SchemaFactory.createForClass(Plan);

@ObjectType()
@Schema({ timestamps: true, collection: 'Programs' })
export class Program extends BaseSchema {
  @Field(() => String)
  @Prop({ type: String, required: true })
  professional!: string;

  @Field()
  @Prop({ type: String, required: true })
  name!: string;

  @Field()
  @Prop({ type: String, required: false })
  description!: string;

  @Field(() => [ProgramTag])
  @Prop({ type: [String], required: true, default: [], ref: ProgramTag.name })
  programTags: String[];

  @Field(() => [Plan])
  @Prop({ type: [PlanSchema], required: false })
  plans!: Plan[];

  @Field(() => [Patient])
  @Prop({ type: [String], required: true, default: [], ref: Patient.name })
  patients: Patient[];

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isSyncActive: boolean;

  @Prop({ type: String, required: true, enum: EnumSources, default: EnumSources.PROFESSIONAL })
  source: EnumSources;

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: boolean;

  @Prop({ type: String, enum: SupportedLanguages, required: false })
  language: SupportedLanguages;
}

export type ProgramDocument = HydratedDocument<Program>;
export const ProgramSchema = SchemaFactory.createForClass(Program);
ProgramSchema.methods.toJSON = function (): Partial<Program> {
  const { __v, createdAt, updatedAt, ...program } = this.toObject();
  return program as Partial<Program>;
};
