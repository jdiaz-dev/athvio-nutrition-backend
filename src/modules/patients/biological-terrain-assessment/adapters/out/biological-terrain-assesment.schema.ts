import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { TerrainAssessment } from 'src/modules/health/terrain-assessment/adapters/out/terrain-assesment.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'BiologicalTerrainAssessments' })
export class BiologicalTerrainAssessment extends TerrainAssessment {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  patient: string;
}

export type BiologicalTerrainAssessmentDocument = HydratedDocument<BiologicalTerrainAssessment>;
export const BiologicalTerrainAssessmentSchema = SchemaFactory.createForClass(BiologicalTerrainAssessment);
BiologicalTerrainAssessmentSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...rest } = this.toObject();
  return rest;
};
