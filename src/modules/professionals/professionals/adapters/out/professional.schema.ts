import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { UnitPreference } from 'src/shared/enums/project';
import { User } from 'src/modules/auth/users/adapters/out/user.schema';
import { BaseSchema } from 'src/shared/adapters/out/schemas/base.schema';

@ObjectType()
@Schema({ _id: false })
export class Organization {
  @Field()
  @Prop({ type: String, required: false })
  company!: string;

  @Prop({ type: String, required: false })
  homePage!: string;

  @Field()
  @Prop({ type: String, required: false })
  address: string;

  @Field()
  @Prop({ type: String, required: false })
  city: string;

  @Field()
  @Prop({ type: String, required: false })
  province: string;

  @Field()
  @Prop({ type: String, required: false })
  postalCode: string;
}
export const OrganizationSchema = SchemaFactory.createForClass(Organization);

@ObjectType()
@Schema({ timestamps: true, collection: 'Professionals' })
export class Professional extends BaseSchema {
  @Field(() => User || String)
  @Prop({ type: String, required: false, ref: User.name })
  user!: User | string;

  @Field()
  @Prop({ type: String, required: false })
  company!: string;

  @Field()
  @Prop({ type: String, required: true, enum: UnitPreference, default: UnitPreference.METRIC })
  unitPreference!: string;

  @Field()
  @Prop({ type: String, required: false })
  timezone!: string;

  @Field()
  @Prop({ type: OrganizationSchema, required: false })
  organization: Organization;

  @Prop({ type: Boolean, required: true, default: true })
  isActive!: boolean;

  @Prop({ type: Boolean, required: true })
  isTrialPeriod: boolean;
}

export type ProfessionalDocument = HydratedDocument<Professional>;
export const ProfessionalSchema = SchemaFactory.createForClass(Professional);
ProfessionalSchema.methods.toJSON = function (): Partial<Professional> {
  const { __v, createdAt, updatedAt, ...profesional } = this.toObject();
  return profesional as Partial<Professional>;
};
