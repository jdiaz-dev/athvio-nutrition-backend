import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngredientsResolver } from 'src/modules/professionals/nutritional-meals/adapters/in/web/ingredients.resolver';
import { NutritionalMealsManagerService } from 'src/modules/professionals/nutritional-meals/application/nutritional-meals-manager.service';
import { ProfessionalsModule } from 'src/modules/professionals/professionals/professionals.module';
import { NutritionalMealsWebResolver } from 'src/modules/professionals/nutritional-meals/adapters/in/web/nutritional-meals-web.resolver';
import {
  NutritionalMeal,
  NutritionalMealSchema,
} from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { AuthenticationModule } from 'src/modules/auth/auth/authentication.module';
import { NutritionalMealsMobileResolver } from 'src/modules/professionals/nutritional-meals/adapters/in/mobile/nutritional-meals-mobile.resolver';
import { UploadScalar } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/upload.scalar';
import { UploadMealImageService } from 'src/modules/professionals/nutritional-meals/application/upload-meal-image.service';
import { SharedModule } from 'src/shared/shared.module';

const resolvers = [NutritionalMealsWebResolver, NutritionalMealsMobileResolver, IngredientsResolver];
const services = [NutritionalMealsPersistenceService, NutritionalMealsManagerService, UploadMealImageService];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NutritionalMeal.name, schema: NutritionalMealSchema }]),
    AuthenticationModule,
    ProfessionalsModule,
    SharedModule,
  ],
  providers: [...resolvers, ...services, UploadScalar],
  exports: [NutritionalMealsPersistenceService],
})
export class NutritionalMealsModule {}
