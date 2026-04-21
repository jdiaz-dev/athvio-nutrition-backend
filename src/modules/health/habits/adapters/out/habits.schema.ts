import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/adapters/out/schemas/base.schema';

@ObjectType()
@Schema({ _id: true, timestamps: true, collection: 'Habits' })
export class Habit extends BaseSchema {
  @Field()
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: Boolean, required: true })
  isActive!: boolean;
}

export type HabitDocument = HydratedDocument<Habit>;
export const HabitSchema = SchemaFactory.createForClass(Habit);
HabitSchema.methods.toJSON = function (): Partial<Habit> {
  const { __v, createdAt, updatedAt, ...habit } = this.toObject();
  return habit as Partial<Habit>;
};
