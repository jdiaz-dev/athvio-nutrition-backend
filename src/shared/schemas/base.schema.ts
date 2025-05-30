import { Field, ObjectType } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';

@ObjectType()
export class BaseSchema {
  _id!: string | MongooseSchema.Types.ObjectId;

  @Field()
  createdAt!: Date;

  updatedAt!: Date;
}
