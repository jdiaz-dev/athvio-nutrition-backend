import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { AlloweGender, ClientState } from 'src/shared/enums/project';
import { ClientGroup } from 'src/modules/professionals/client-groups/adapters/out/client-group.schema';

@ObjectType()
@Schema({ timestamps: true, collection: 'Clients' })
export class Client extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professionalId!: string;

  @Field(() => [ClientGroup])
  @Prop({ type: [String], required: true, default: [], ref: ClientGroup.name })
  groups!: [string];

  @Field()
  @Prop({ type: String, required: false })
  location!: string;

  @Field()
  @Prop({ type: String, required: false })
  timezone!: string;

  @Field()
  @Prop({ type: Number, required: false })
  height!: number;

  @Field()
  @Prop({ type: Number, required: false })
  weight!: number;

  @Field()
  @Prop({ type: Date, required: false })
  birthday!: Date;

  @Field()
  @Prop({ type: String, enum: AlloweGender, required: false })
  gender!: string;

  @Field()
  @Prop({ type: String, required: false })
  profilePicture!: string;

  @Field()
  @Prop({ type: String, required: false })
  codeCountry!: string;

  @Field()
  @Prop({ type: String, required: false })
  phone!: string;

  @Field()
  @Prop({ type: String, required: false })
  target!: string;

  @Field()
  @Prop({ type: String, required: false })
  limitation!: string;

  @Field()
  @Prop({ type: String, required: false })
  notes!: string;

  @Prop({ type: String, enum: ClientState, required: true, default: ClientState.INACTIVE })
  state!: ClientState;

}

export type ClientDocument = Client & Document;
export const ClientSchema = SchemaFactory.createForClass(Client);
ClientSchema.methods.toJSON = function () {
  let { __v, createdAt, updatedAt, ...clientGroup } = this.toObject();
  return clientGroup;
};
