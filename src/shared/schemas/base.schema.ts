import { ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@ObjectType()
export class BaseSchema {
  _id!: string;

  @Prop({ type: MongooseSchema.Types.Date })
  createdAt!: Date;

  @Prop({ type: MongooseSchema.Types.Date })
  updatedAt!: Date;
}
