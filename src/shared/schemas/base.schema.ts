import { Field, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@ObjectType()
export class BaseSchema {
  _id!: string | MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop({ type: String, required: true, unique: true })
  uuid: string;

  @Field()
  createdAt!: Date;

  updatedAt!: Date;
}
