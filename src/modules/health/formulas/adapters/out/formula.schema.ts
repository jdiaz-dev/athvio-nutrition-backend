import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/adapters/out/schemas/base.schema';

@ObjectType()
@Schema({ _id: false, timestamps: false })
export class ValueCase {
  @Field()
  @Prop({ type: Number, required: true })
  value: number;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  case?: string;

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  spanishCase?: string;
}
export const ValueCaseSchema = SchemaFactory.createForClass(ValueCase);

@ObjectType()
@Schema({ _id: false, timestamps: false })
export class Parameter {
  @Field()
  @Prop({ type: String, required: true })
  spanishParameterName: string;

  @Field()
  @Prop({ type: String, required: true })
  description: string;

  @Field(() => [ValueCase])
  @Prop({ type: [ValueCaseSchema], required: true })
  valueCases: ValueCase[];
}
export const ParameterSchema = SchemaFactory.createForClass(Parameter);

@ObjectType()
@Schema({ _id: false, timestamps: false })
export class Constant {
  @Field()
  @Prop({ type: String, required: true })
  name: string;

  @Field({ nullable: true })
  @Prop({ type: Number, required: false })
  value: number;
}
export const ConstantSchema = SchemaFactory.createForClass(Constant);

@ObjectType()
@Schema({ _id: false, timestamps: false })
export class Coefficient {
  @Field()
  @Prop({ type: String, required: true })
  variable: string;

  @Field({ nullable: true })
  @Prop({ type: Number, required: false })
  value: number;
}
export const CoefficientSchema = SchemaFactory.createForClass(Coefficient);

@ObjectType()
@Schema({ _id: false, timestamps: false })
export class Case {
  @Field()
  @Prop({ type: String, required: true })
  spanishCaseLabel: string;

  @Field()
  @Prop({ type: String, required: true })
  case: string;

  @Field(() => [Coefficient])
  @Prop({ type: [CoefficientSchema], required: true })
  coefficients: Coefficient[];

  @Field(() => [Constant])
  @Prop({ type: [ConstantSchema], required: false })
  constants: Constant[];
}
export const CaseSchema = SchemaFactory.createForClass(Case);

@ObjectType()
@Schema({ _id: false, timestamps: false })
export class FormulaGroup {
  @Field()
  @Prop({ type: String, required: false })
  spanishFormulaName: string;

  @Field(() => [Case])
  @Prop({ type: [CaseSchema], required: true })
  cases: Case[];

  @Field({ nullable: true })
  @Prop({ type: String, required: false })
  parameterDescription: string;

  @Field(() => [Parameter])
  @Prop({ type: [ParameterSchema], required: true })
  parameters: Parameter[];
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
