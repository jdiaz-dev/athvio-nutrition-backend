import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/adapters/out/schemas/base.schema';

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
export class ConfiguredMacros {
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
  proteinDensity: number;

  @Field()
  @Prop({ type: Number, required: true })
  carbsDensity: number;

  @Field()
  @Prop({ type: Number, required: true })
  fatDensity: number;

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
  basalEnergyRate: number;

  @Field()
  @Prop({ type: Number, required: true })
  totalCalories: number;

  @Field()
  @Prop({ type: Number, required: true })
  planCalories: number;
}
const MacroSchema = SchemaFactory.createForClass(ConfiguredMacros);

@ObjectType()
@Schema({ timestamps: true, collection: 'Planifications' })
export class Planification extends BaseSchema {
  @Field()
  @Prop({ type: String, required: true })
  patient: string;

  @Field(() => PatientInformation)
  @Prop({ type: PatientInformationSchema, required: true })
  patientInformation: PatientInformation;

  @Field(() => ConfiguredMacros)
  @Prop({ type: MacroSchema, required: true })
  configuredMacros!: ConfiguredMacros;

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
