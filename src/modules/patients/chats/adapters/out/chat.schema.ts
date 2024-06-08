import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { Professional } from 'src/modules/professionals/professionals/adapters/out/professional.schema';
import { CommenterType } from 'src/shared/enums/project';

@ObjectType()
@Schema({ _id: true })
export class ChatComment extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: String, enum: CommenterType, required: true })
  commenter: CommenterType;

  @Field()
  @Prop({ type: String, required: true })
  content: string;
}

const ChatCommentSchema = SchemaFactory.createForClass(ChatComment);

@ObjectType()
@Schema({ timestamps: true, collection: 'Chats' })
export class Chat extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => Professional || String)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: Professional.name })
  professional!: Professional | string;

  @Field(() => String || Patient)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: Patient.name })
  patient: string | Patient;

  @Field(() => [ChatComment])
  @Prop({ type: [ChatCommentSchema], required: true, default: [] })
  comments: ChatComment[];
}

export type ChatDocument = Chat & Document;
export const ChatSchema = SchemaFactory.createForClass(Chat);
ChatSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...chat } = this.toObject();
  return chat;
};
