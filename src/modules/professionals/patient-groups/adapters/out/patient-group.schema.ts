import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'PatientGroups' })
export class PatientGroup extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professional!: string;

  @Field()
  @Prop({ type: String, required: true })
  groupName!: string;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type PatientGroupDocument = HydratedDocument<PatientGroup>;
export const PatientGroupSchema = SchemaFactory.createForClass(PatientGroup);
PatientGroupSchema.methods.toJSON = function (): Partial<PatientGroup> {
  const { __v, createdAt, updatedAt, ...patientGroup } = this.toObject();
  return patientGroup as Partial<PatientGroup>;
};
