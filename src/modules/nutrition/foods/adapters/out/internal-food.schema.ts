import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/adapters/out/schemas/base.schema';

@Schema({ _id: false, timestamps: false })
export class Measure {
  @Prop({ type: String, required: false })
  uri: string;

  @Prop({ type: String, required: false })
  label?: string;

  @Prop({ type: Number, required: false })
  weight: number;
}
export const MeasureSchema = SchemaFactory.createForClass(Measure);

@Schema({ _id: false, timestamps: false })
export class Nutrients {
  @Prop({ type: Number, required: false })
  ENERC_KCAL: number;

  @Prop({ type: Number, required: false })
  PROCNT: number;

  @Prop({ type: Number, required: false })
  FAT: number;

  @Prop({ type: Number, required: false })
  CHOCDF: number;

  @Prop({ type: Number, required: false })
  FIBTG: number;
}
export const NutrientsSchema = SchemaFactory.createForClass(Nutrients);

@Schema({ _id: false, timestamps: false })
export class FoodDetails {
  @Prop({ type: String, required: false })
  foodId: string;

  @Prop({ type: String, required: false })
  label: string;

  @Prop({ type: String, required: false })
  knownAs: string;

  @Prop({ type: NutrientsSchema, required: false })
  nutrients: Nutrients;

  @Prop({ type: String, required: false })
  category: string;

  @Prop({ type: String, required: false })
  categoryLabel: string;

  @Prop({ type: String, required: false })
  image: string;
}
export const FoodDetailsSchema = SchemaFactory.createForClass(FoodDetails);

@ObjectType()
@Schema({ timestamps: true, collection: 'InternalFoods' })
export class InternalFood extends BaseSchema {
  @Prop({ type: FoodDetailsSchema, required: false })
  foodDetails: FoodDetails;

  @Prop({ type: [MeasureSchema], required: false })
  measures: Measure[];
}

export type InternalFoodDocument = InternalFood & Document;
export const InternalFoodSchema = SchemaFactory.createForClass(InternalFood);
InternalFoodSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...food } = this.toObject();
  return food;
};
InternalFoodSchema.index({ 'foodDetails.label': 'text' });
