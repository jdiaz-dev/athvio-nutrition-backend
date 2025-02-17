import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { EnumRoles } from 'src/shared/enums/project';

@ObjectType()
@Schema({ _id: true, timestamps: true, collection: 'Users' })
export class User extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: String, required: true })
  firstname: string;

  @Field()
  @Prop({ type: String, required: true })
  lastname: string;

  @Field()
  @Prop({ type: String, unique: true, required: true })
  email!: string;

  @Prop({ type: String, required: false })
  password!: string;

  @Field()
  @Prop({ type: String, required: false })
  countryCode!: string;

  @Field()
  @Prop({ type: String, required: false })
  country!: string;

  @Field()
  @Prop({ type: String, required: false })
  phone!: string;

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

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods.toJSON = function (): Partial<User> {
  const { __v, createdAt, updatedAt, ...user } = this.toObject();
  return user as Partial<User>;
};
