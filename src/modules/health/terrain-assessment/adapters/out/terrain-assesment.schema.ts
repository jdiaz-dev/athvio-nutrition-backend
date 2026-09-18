import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/adapters/database/schemas/base.schema';

@ObjectType()
export class Observation {
  @Field(() => String)
  @Prop({ type: String, required: true })
  key!: string; // stable machine key, e.g. "energyState", "emotionalState"

  @Field(() => String)
  @Prop({ type: String, required: true })
  label!: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  value!: string;
}
export const ObservationSchema = SchemaFactory.createForClass(Observation);

export enum FunctionalScreeningScore {
  GOOD = 0, // 🟢 Buena función
  MODERATE = 1, // 🟡 Alteración moderada
  SEVERE = 2, // 🔴 Alteración importante
}
registerEnumType(FunctionalScreeningScore, { name: 'FunctionalScreeningScore' });

@ObjectType()
export class FunctionalScreening {
  @Field(() => String)
  @Prop({ type: String, required: true })
  question!: string;

  @Field(() => FunctionalScreeningScore, { nullable: true })
  @Prop({ type: Number, enum: FunctionalScreeningScore, required: false })
  score!: FunctionalScreeningScore;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  note!: string;
}
export const FunctionalScreeningAnswerSchema = SchemaFactory.createForClass(FunctionalScreening);

@ObjectType()
@Schema({ timestamps: true, collection: 'TerrainAssessment' })
export class TerrainAssessment extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => [Observation])
  @Prop({ type: [ObservationSchema], required: true, default: [] })
  generalObservations!: Observation[];

  @Field(() => [FunctionalScreening])
  @Prop({ type: [FunctionalScreeningAnswerSchema], required: true, default: [] })
  functionalScreeningQuestions!: FunctionalScreening[];

  @Field(() => Int, { nullable: true })
  @Prop({ type: Number, required: false, default: 0 })
  totalScore!: number;
}

export type TerrainAssessmentDocument = HydratedDocument<TerrainAssessment>;
export const TerrainAssessmentSchema = SchemaFactory.createForClass(TerrainAssessment);
TerrainAssessmentSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...rest } = this.toObject();
  return rest;
};
