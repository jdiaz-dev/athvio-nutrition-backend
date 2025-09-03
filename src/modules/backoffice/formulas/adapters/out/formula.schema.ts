import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@Schema({ _id: false, timestamps: false })
export class Constant {
  @Prop({ type: String, required: true })
  spanishConstantName: string;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: String, required: false })
  case?: string;
}
export const NutrientsSchema = SchemaFactory.createForClass(Constant);

@Schema({ _id: false, timestamps: false })
export class FormulaGroup {
  @Prop({ type: String, required: false })
  spanishFormulaName: string;

  @Prop({ type: [NutrientsSchema], required: true })
  constants: Constant[];
}
export const FormulaGroupSchema = SchemaFactory.createForClass(FormulaGroup);

@ObjectType()
@Schema({ timestamps: true, collection: 'Formulas' })
export class Formula extends BaseSchema {
  @Prop({ type: String, required: true })
  spanishGroupName: string;

  @Prop({ type: [FormulaGroupSchema], required: false })
  formulaGroups: FormulaGroup[];
}

export type FormulaDocument = Formula & Document;
export const FormulaSchema = SchemaFactory.createForClass(Formula);
FormulaSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...rest } = this.toObject();
  return rest;
};
