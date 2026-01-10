import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { EnumSources } from 'src/shared/enums/project';
import { BaseSchema } from 'src/shared/adapters/out/schemas/base.schema';
import { Meal, MealSchema } from 'src/shared/adapters/out/schemas/meal-plan';

@ObjectType()
@Schema({ _id: true, timestamps: true })
export class PlanBase extends BaseSchema {
  @Field()
  @Prop({ type: String, required: false, default: '' })
  title!: string;

  @Field()
  @Prop({ type: Number, required: true })
  week!: number;

  @Field()
  @Prop({ type: Number, required: true })
  day!: number;

  @Field(() => [Meal])
  @Prop({ type: [MealSchema], required: true, default: [] })
  meals!: Meal[];

  //planWorkouts: any;

  @Field()
  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;
}
const PlanSchema = SchemaFactory.createForClass(PlanBase);

@ObjectType()
export class ProgramBase extends BaseSchema {
  @Field()
  @Prop({ type: String, required: true })
  name!: string;

  @Field(() => [PlanBase])
  @Prop({ type: [PlanSchema], required: false })
  plans!: PlanBase[];

  @Prop({ type: String, required: true, enum: EnumSources, default: EnumSources.PROFESSIONAL })
  source: EnumSources;

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted!: boolean;
}
