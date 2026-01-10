import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { ProgramBase } from 'src/shared/adapters/out/schemas/program-base.schema';
import { HydratedDocument } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true, collection: 'PatientPrograms' })
export class PatientProgram extends ProgramBase {
  @Field(() => String)
  @Prop({ type: String, required: true })
  patient!: string;
}
export type PatientProgramDocument = HydratedDocument<PatientProgram>;
export const PatientProgramSchema = SchemaFactory.createForClass(PatientProgram);
PatientProgramSchema.methods.toJSON = function (): Partial<PatientProgram> {
  const { __v, createdAt, updatedAt, ...program } = this.toObject();
  return program as Partial<PatientProgram>;
};
