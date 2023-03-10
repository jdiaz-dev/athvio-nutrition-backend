import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { AlloweGender, ClientState } from 'src/shared/enums/project';
import { ClientGroup } from 'src/modules/users/client-groups/adapters/out/client-group.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'Clients' })
export class Client extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userId!: string;

  @Field(() => [ClientGroup])
  @Prop({ type: [String], required: true, default: [], ref: ClientGroup.name })
  groups!: [string];

  @Field()
  @Prop({ type: String, required: true })
  firstName!: string;

  @Field()
  @Prop({ type: String, required: true })
  lastName!: string;

  @Field()
  @Prop({ type: String, required: true })
  email!: string;

  @Field()
  @Prop({ type: String, required: true })
  location!: string;

  @Field()
  @Prop({ type: String, required: false })
  timezone!: string;

  @Field()
  @Prop({ type: Number, required: true })
  height!: number;

  @Field()
  @Prop({ type: Number, required: true })
  weight!: number;

  @Field()
  @Prop({ type: Date, required: true })
  birthday!: Date;

  @Field()
  @Prop({ type: String, enum: AlloweGender, required: true })
  gender!: string;

  @Field()
  @Prop({ type: String, required: false })
  profilePicture!: string;

  @Field()
  @Prop({ type: String, required: true })
  codeCountry!: string;

  @Field()
  @Prop({ type: String, required: true })
  phone!: string;

  @Field()
  @Prop({ type: String, required: true })
  target!: string;

  @Field()
  @Prop({ type: String, required: true })
  limitation!: string;

  @Field()
  @Prop({ type: String, required: true })
  notes!: string;

  @Prop({ type: String, enum: ClientState, required: true, default: ClientState.ACTIVE })
  state!: string;

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type ClientDocument = Client & Document;
export const ClientSchema = SchemaFactory.createForClass(Client);
ClientSchema.methods.toJSON = function () {
  let { __v, createdAt, updatedAt, ...clientGroup } = this.toObject();
  return clientGroup;
};
