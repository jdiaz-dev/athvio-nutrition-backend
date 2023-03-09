import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { Ingredient, IngredientSchema } from 'src/shared/models/ingredients';
import { ProgramTag } from 'src/modules/users/program-tags/adapters/out/program-tag.schema';

@ObjectType()
@Schema({ _id: false })
export class Macros {
  @Field()
  @Prop({ type: Number, required: true })
  calories!: number;

  @Field()
  @Prop({ type: Number, required: true })
  protein!: number;

  @Field()
  @Prop({ type: Number, required: true })
  carbs!: number;

  @Field()
  @Prop({ type: Number, required: true })
  fat!: number;
}

@ObjectType()
@Schema({ _id: false })
export class Meal {
  @Field()
  @Prop({ type: String, required: false })
  tagFood: string; //I don't remember the use case

  @Field()
  @Prop({ type: Number, required: true })
  position: number;

  @Field()
  @Prop({ type: String, required: true })
  recipeName: string;

  @Field(() => [Ingredient])
  @Prop({ type: [IngredientSchema], required: true })
  ingredients: Ingredient[];

  @Field()
  @Prop({ type: String, required: true })
  recipe: string;

  @Field()
  @Prop({ type: Boolean, required: true })
  isDeleted: boolean;

  @Field()
  @Prop({ type: Macros, required: true })
  macros: Macros;
}
const MealSchema = SchemaFactory.createForClass(Meal);

@ObjectType()
@Schema({ timestamps: true, _id: true })
export class Plan {
  @Field(() => ID)
  _id!: string;

  @Field()
  @Prop({ type: Number, required: true })
  week!: number;

  @Field()
  @Prop({ type: Number, required: true })
  day!: number;

  @Field(() => [Meal])
  @Prop({ type: [MealSchema], required: true, default: [] })
  planMeals!: Meal[];

  //planWorkouts: any;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;
}
const PlanSchema = SchemaFactory.createForClass(Plan);

@ObjectType()
@Schema({ timestamps: true, collection: 'Programs' })
export class Program extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userId!: string;

  @Field()
  @Prop({ type: String, required: true })
  name!: string;

  @Field()
  @Prop({ type: String, required: true })
  description!: string;

  // @Field
  @Field(() => [ProgramTag])
  @Prop({ type: [String], required: true, default: [], ref: ProgramTag.name })
  tags: String[];

  @Field(() => [Plan])
  @Prop({ type: [PlanSchema], required: false })
  plans!: [Plan];

  @Field(() => [String])
  @Prop({ type: [String], required: true, default: [] })
  clients: string[];

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type ProgramDocument = Program & Document;
export const ProgramSchema = SchemaFactory.createForClass(Program);
ProgramSchema.methods.toJSON = function () {
  let { __v, createdAt, updatedAt, ...program } = this.toObject();
  //   console.log('----------programTag json', programTag);
  return program;
};
