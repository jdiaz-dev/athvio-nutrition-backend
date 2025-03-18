import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { AllowedGender, OriginPatientEnum, PatientState } from 'src/shared/enums/project';
import { PatientGroup } from 'src/modules/professionals/patient-groups/adapters/out/patient-group.schema';
import { User } from 'src/modules/auth/users/adapters/out/user.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'Patients' })
export class Patient extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => User)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, ref: User.name })
  user!: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, required: false })
  professional!: string;

  @Field(() => [PatientGroup])
  @Prop({ type: [String], required: true, default: [], ref: PatientGroup.name, index: true })
  groups!: [string];

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  location!: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  timezone!: string;

  @Field({ nullable: true })
  @Prop({ type: Number, required: false })
  height!: number;

  @Field({ nullable: true })
  @Prop({ type: Number, required: false })
  weight!: number;

  @Field({ nullable: true })
  @Prop({ type: Date, required: false })
  birthday!: Date;

  @Field({ nullable: true })
  @Prop({ type: String, enum: AllowedGender, required: false })
  gender!: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  phone!: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  target!: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  limitation!: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  notes!: string;

  @Field({ nullable: true })
  @Prop({ type: String, enum: PatientState, required: true, default: PatientState.INVITATION_PENDING })
  state!: PatientState;

  @Prop({ type: String, enum: OriginPatientEnum, required: true })
  origin: OriginPatientEnum;
}

export type PatientDocument = Patient & Document;
export const PatientSchema = SchemaFactory.createForClass(Patient);
PatientSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...patient } = this.toObject();
  return patient;
};
