import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'ClientGroups' })
export class ClientGroup extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userId!: string;

  @Field()
  @Prop({ type: String, required: true })
  title!: string;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type ClientGroupDocument = ClientGroup & Document;
export const ClientGroupSchema = SchemaFactory.createForClass(ClientGroup);
ClientGroupSchema.methods.toJSON = function () {
  let { __v, createdAt, updatedAt, ...clientGroup } = this.toObject();
  //   console.log('----------clientGroup json', clientGroup);
  return clientGroup;
};
