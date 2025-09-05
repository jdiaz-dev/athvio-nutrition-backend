import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ _id: false })
export class PatientInformation {
  @Field()
  @Prop({ type: Number, required: true })
  weight: number;

  @Field()
  @Prop({ type: Number, required: true })
  height: number;

  @Field()
  @Prop({ type: Number, required: true })
  age: number;

  @Field()
  @Prop({ type: String, required: true })
  gender: string;

  @Field()
  @Prop({ type: String, required: true })
  physicActivityName: string;

  @Field()
  @Prop({ type: Number, required: true })
  physicActivityFactor: number;
}
const PatientInformationSchema = SchemaFactory.createForClass(PatientInformation);

@ObjectType()
@Schema({ _id: false })
export class CalculatedMacros {
  @Field()
  @Prop({ type: Number, required: true })
  proteinInPercentage: number;

  @Field()
  @Prop({ type: Number, required: true })
  carbsInPercentage: number;

  @Field()
  @Prop({ type: Number, required: true })
  fatInPercentage: number;

  @Field()
  @Prop({ type: Number, required: true })
  totalProtein: number;

  @Field()
  @Prop({ type: Number, required: true })
  totalCarbs: number;

  @Field()
  @Prop({ type: Number, required: true })
  totalFat: number;

  @Field()
  @Prop({ type: Number, required: true })
  totalCalories: number;
}
const MacroSchema = SchemaFactory.createForClass(CalculatedMacros);

@ObjectType()
@Schema({ timestamps: true, collection: 'Planifications' })
export class Planification extends BaseSchema {
  @Field()
  @Prop({ type: String, required: true })
  patient: string;

  @Field(() => PatientInformation)
  @Prop({ type: PatientInformationSchema, required: true })
  patientInformation: PatientInformation;

  @Field(() => CalculatedMacros)
  @Prop({ type: MacroSchema, required: true })
  configuredMacros!: CalculatedMacros;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type PlanificationDocument = HydratedDocument<Planification>;
export const PlanificationSchema = SchemaFactory.createForClass(Planification);
PlanificationSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...rest } = this.toObject();
  return rest;
};
