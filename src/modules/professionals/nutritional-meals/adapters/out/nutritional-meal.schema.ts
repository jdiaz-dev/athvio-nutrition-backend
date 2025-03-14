import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BaseSchema } from 'src/shared/schemas/base.schema';
import { IngredientDetail, IngredientDetailSchema } from 'src/shared/models/meal-plan';
import { Macros, MacroSchema } from 'src/shared/models/macros';
import { EnumMealOwner } from 'src/shared/enums/project';

enum SystemMealSourcesEnum {
  BEAT_CANCER_KITCHEN = 'Beat cancer kitchen',
}

@Schema()
export class RelatedStudy {
  @Prop({ type: String, required: false })
  summary!: string;

  @Prop({ type: String, required: false })
  link!: string;
}
export const RelatedStudySchema = SchemaFactory.createForClass(RelatedStudy);

@ObjectType()
@Schema({ timestamps: true, collection: 'NutritionalMeals' })
export class NutritionalMeal extends BaseSchema {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  professional!: string;

  @Field()
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => [IngredientDetail])
  @Prop({ type: [IngredientDetailSchema], required: true })
  ingredientDetails: IngredientDetail[];

  @Field()
  @Prop({ type: String, required: false })
  cookingInstructions!: string;

  //todo: remove notes ?
  @Prop({ type: String, required: false })
  notes!: string;

  @Prop({ type: String, required: false })
  image!: string;

  @Field()
  @Prop({ type: MacroSchema, required: true })
  macros: Macros;

  @Field()
  @Prop({ type: String, required: false })
  yield: string;

  @Field()
  @Prop({ type: String, required: false })
  servings: string;

  @Field()
  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, required: false })
  healthBenefits: string;

  @Prop({ type: String, required: true, enum: EnumMealOwner, default: EnumMealOwner.SYSTEM })
  owner: EnumMealOwner;

  @Prop({ type: String, required: false, default: SystemMealSourcesEnum.BEAT_CANCER_KITCHEN })
  source: SystemMealSourcesEnum;

  @Prop({ type: String, required: false })
  category: string;

  @Prop({ type: [RelatedStudySchema], required: false })
  relatedStudies: RelatedStudy[];

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: string;
}

export type NutritionalDocument = NutritionalMeal & Document;
export const NutritionalMealSchema = SchemaFactory.createForClass(NutritionalMeal);
NutritionalMealSchema.methods.toJSON = function (): Partial<NutritionalMeal> {
  const { __v, createdAt, updatedAt, ...nutritionalMeal } = this.toObject();
  return nutritionalMeal as Partial<NutritionalMeal>;
};
