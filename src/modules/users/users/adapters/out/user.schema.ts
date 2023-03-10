import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'Users' })
export class User extends BaseSchema {
  @Field(() => ID)
  userId!: string;

  @Field()
  @Prop({ type: String, required: true })
  firstName!: string;

  @Field()
  @Prop({ type: String, required: true })
  lastName!: string;

  @Field()
  @Prop({ type: String, required: true, unique: true })
  email!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Field()
  @Prop({ type: String, required: false })
  image!: string;

  @Field()
  @Prop({ type: Boolean, required: true, default: true })
  isDarkMode!: true;

  @Prop({ type: Boolean, required: true, default: true })
  isActive!: boolean;

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods.toJSON = function () {
  let { _id, __v, createdAt, updatedAt, ...user } = this.toObject();
  user.userId = _id;
  return user;
};
