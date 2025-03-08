import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsResolver } from 'src/modules/professionals/nutritional-meals/adapters/in/ingredients.resolver';
import { NutritionalMealsManagerService } from 'src/modules/professionals/nutritional-meals/application/nutritional-meals-manager.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { NutritionalMealsResolver } from 'src/modules/professionals/nutritional-meals/adapters/in/nutritional-meals.resolver';
import { NutritionalMeal, NutritionalMealSchema } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';

const resolvers = [NutritionalMealsResolver, IngredientsResolver];
const services = [NutritionalMealsPersistenceService, NutritionalMealsManagerService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NutritionalMeal.name, schema: NutritionalMealSchema }]),
    AuthenticationModule,
    ProfessionalsModule,
  ],
  providers: [...resolvers, ...services],
  exports: [NutritionalMealsPersistenceService],
})
export class NutritionalMealsModule {}
