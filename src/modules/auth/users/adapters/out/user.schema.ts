import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { EnumRoles } from 'src/modules/auth/shared/enums';

@ObjectType()
@Schema({ _id: true, timestamps: true, collection: 'Users' })
export class User extends BaseSchema {
  _id!: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  firstname: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  lastname: string;

  @Field()
  @Prop({ type: String, unique: true, required: true })
  email!: string;

  @Prop({ type: String, required: false })
  password?: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  countryCode!: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  phone!: string;

  @Field()
  @Prop({ type: String, required: false })
  country!: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  photo!: string;

  @Field()
  @Prop({ type: String, required: true, enum: EnumRoles })
  role: EnumRoles;

  @Prop({ type: Boolean, required: true })
  isActive!: boolean;

  @Prop({ type: Boolean, required: false })
  acceptedTerms!: boolean;

  @Field()
  @Prop({ type: Boolean, required: true, default: true })
  isDarkMode!: true;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods.toJSON = function (): Partial<User> {
  const { __v, createdAt, updatedAt, ...user } = this.toObject();
  return user as Partial<User>;
};
