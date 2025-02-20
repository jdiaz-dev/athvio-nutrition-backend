import { Module } from '@nestjs/common';
import { DiseaseCausesModule } from 'src/modules/nutrition-builder/disease-causes/disease-causes.module';
import { DiseasesModule } from 'src/modules/nutrition-builder/diseases/diseases.module';
import { FoodsModule } from 'src/modules/nutrition-builder/foods/foods.module';
import { NutritionalPreferencesModule } from 'src/modules/nutrition-builder/nutritional-preferences/nutritional-preferences.module';

@Module({
  imports: [DiseaseCausesModule, DiseasesModule, NutritionalPreferencesModule, FoodsModule],
})
export class NutritionBuilderDomainsModule {}
