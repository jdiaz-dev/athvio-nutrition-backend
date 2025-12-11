import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/adapters/out/schemas/base.schema';

@ObjectType()
@Schema({ _id: false, timestamps: false })
export class Nutrient {
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  label?: string;
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  spanishLabel?: string;
  @Field(() => Number, { nullable: true })
  @Prop({ type: Number, required: false })
  quantity?: number;
  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  unit?: string;
}
export const NutrientSchema = SchemaFactory.createForClass(Nutrient);

@ObjectType()
@Schema({ _id: false, timestamps: false })
export class NutrientDetails {
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  CA?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  CHOCDF_NET?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  CHOCDF?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  CHOLE?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  ENERC_KCAL?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  FAMS?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  FAT?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  FAPU?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  FASAT?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  FATRN?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  FIBTG?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  FOLDFE?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  FOLFD?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  FOLAC?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  FE?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  K?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  MG?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  NA?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  NIA?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  P?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  PROCNT?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  RIBF?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  SUGAR?: Nutrient;
  // @Field(() => Nutrient, { nullable: true })
  // @Prop({ type: NutrientSchema, required: false })
  // Sugaralcohol'?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  SUGAR_ADDED?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  THIA?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  TOCPHA?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  VITA_RAE?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  VITB12?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  VITB6A?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  VITC?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  VITD?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  VITK1?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  WATER?: Nutrient;
  @Field(() => Nutrient, { nullable: true })
  @Prop({ type: NutrientSchema, required: false })
  ZN?: Nutrient;
}
export const NutrientDetailsSchema = SchemaFactory.createForClass(NutrientDetails);

@Schema({ _id: false, timestamps: false })
export class Measure {
  @Prop({ type: String, required: false })
  uri: string;

  @Prop({ type: String, required: false })
  label?: string;

  @Prop({ type: String, required: false })
  spanishLabel?: string;

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

  @Prop({ type: NutrientDetailsSchema, required: false })
  nutrientDetails?: NutrientDetails;

  @Prop({ type: [String], required: false })
  dietLabels?: string[];

  @Prop({ type: [String], required: false })
  healthLabels?: string[];

  //todo: remove it
  @Prop({ type: Boolean, required: false })
  isSuccessfullUpdated?: boolean;
}

export type InternalFoodDocument = InternalFood & Document;
export const InternalFoodSchema = SchemaFactory.createForClass(InternalFood);
InternalFoodSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...food } = this.toObject();
  return food;
};
InternalFoodSchema.index({ 'foodDetails.label': 'text' });
