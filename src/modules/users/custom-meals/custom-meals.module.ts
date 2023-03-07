import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomMealsResolver } from './adapters/in/custom-meals.resolver';
import { CustomMeal, CustomMealSchema } from './adapters/out/custom-meal.schema';
import { CustomMealsPersistenceService } from './adapters/out/custom-meals-persistence.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: CustomMeal.name, schema: CustomMealSchema }])],
  providers: [CustomMealsResolver, CustomMealsPersistenceService],
})
export class CustomMealsModule {}
