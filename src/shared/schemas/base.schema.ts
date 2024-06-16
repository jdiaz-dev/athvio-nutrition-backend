import { Field, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@ObjectType()
export class BaseSchema {
  _id!: string;

  @Field()
  @Prop({ type: MongooseSchema.Types.Date, required: true, default: new Date() })
  createdAt!: Date;

  @Prop({ type: MongooseSchema.Types.Date, required: true, default: new Date() })
  updatedAt!: Date;
}
