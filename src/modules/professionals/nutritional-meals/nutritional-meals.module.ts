import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsResolver } from 'src/modules/professionals/nutritional-meals/adapters/in/web/ingredients.resolver';
import { NutritionalMealsManagerService } from 'src/modules/professionals/nutritional-meals/application/nutritional-meals-manager.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { NutritionalMealsWebResolver } from 'src/modules/professionals/nutritional-meals/adapters/in/web/nutritional-meals.web.resolver';
import {
  NutritionalMeal,
  NutritionalMealSchema,
} from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { NutritionalMealsMobileResolver } from 'src/modules/professionals/nutritional-meals/adapters/in/mobile/nutritional-meals-mobile.resolver';
import { NutritionalMealImageManagerService } from 'src/modules/professionals/nutritional-meals/application/nutritional-meal-image-manager.service';
import { SharedModule } from 'src/shared/shared.module';
import { NutritionalMealsSystemResolver } from 'src/modules/professionals/nutritional-meals/adapters/in/web/nutritional-meals.system.resolver';

const resolvers = [
  IngredientsResolver,
  NutritionalMealsWebResolver,
  NutritionalMealsMobileResolver,
  NutritionalMealsSystemResolver,
];
const services = [NutritionalMealsPersistenceService, NutritionalMealsManagerService, NutritionalMealImageManagerService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NutritionalMeal.name, schema: NutritionalMealSchema }]),
    AuthModule,
    ProfessionalsModule,
    SharedModule,
  ],
  providers: [...resolvers, ...services],
  exports: [NutritionalMealsPersistenceService],
})
export class NutritionalMealsModule {}
