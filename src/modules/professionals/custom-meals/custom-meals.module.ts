import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsResolver } from 'src/modules/professionals/custom-meals/adapters/in/ingredients.resolver';
import { CustomMealsManagementService } from 'src/modules/professionals/custom-meals/application/custom-meals-management.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { UsersModule } from 'src/modules/security/users/users.module';
import { CustomMealsResolver } from './adapters/in/custom-meals.resolver';
import { CustomMeal, CustomMealSchema } from './adapters/out/custom-meal.schema';
import { CustomMealsPersistenceService } from './adapters/out/custom-meals-persistence.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CustomMeal.name, schema: CustomMealSchema }]),
    ProfessionalsModule,
    UsersModule,
  ],
  providers: [
    ...[CustomMealsResolver, IngredientsResolver],
    ...[CustomMealsPersistenceService, CustomMealsManagementService],
  ],
})
export class CustomMealsModule {}
