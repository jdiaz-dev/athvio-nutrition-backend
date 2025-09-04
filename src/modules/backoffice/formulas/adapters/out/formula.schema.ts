import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';

@ObjectType()
@Schema({ _id: false, timestamps: false })
export class Constant {
  @Field()
  @Prop({ type: String, required: true })
  spanishConstantName: string;

  @Field()
  @Prop({ type: Number, required: true })
  value: number;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  case?: string;
}
export const NutrientsSchema = SchemaFactory.createForClass(Constant);

@ObjectType()
@Schema({ _id: false, timestamps: false })
export class FormulaGroup {
  @Field()
  @Prop({ type: String, required: false })
  spanishFormulaName: string;

  @Field(() => [Constant])
  @Prop({ type: [NutrientsSchema], required: true })
  constants: Constant[];
}
export const FormulaGroupSchema = SchemaFactory.createForClass(FormulaGroup);

@ObjectType()
@Schema({ timestamps: true, collection: 'Formulas' })
export class Formula extends BaseSchema {
  @Field()
  @Prop({ type: String, required: true })
  spanishGroupName: string;

  @Field(() => [FormulaGroup])
  @Prop({ type: [FormulaGroupSchema], required: false })
  formulaGroups: FormulaGroup[];
}

export type FormulaDocument = Formula & Document;
export const FormulaSchema = SchemaFactory.createForClass(Formula);
FormulaSchema.methods.toJSON = function () {
  const { __v, createdAt, updatedAt, ...rest } = this.toObject();
  return rest;
};
