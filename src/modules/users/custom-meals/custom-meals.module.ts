import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsResolver } from 'src/modules/users/custom-meals/adapters/in/ingredients.resolver';
import { CustomMealsResolver } from './adapters/in/custom-meals.resolver';
import { CustomMeal, CustomMealSchema } from './adapters/out/custom-meal.schema';
import { CustomMealsPersistenceService } from './adapters/out/custom-meals-persistence.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: CustomMeal.name, schema: CustomMealSchema }])],
  providers: [CustomMealsResolver, IngredientsResolver, CustomMealsPersistenceService],
})
export class CustomMealsModule {}
