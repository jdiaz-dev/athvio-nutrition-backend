import { Module } from '@nestjs/common';
import { DiseaseCausesModule } from 'src/modules/nutrition-generator/disease-causes/disease-causes.module';
import { DiseasesModule } from 'src/modules/nutrition-generator/diseases/diseases.module';
import { FoodsModule } from 'src/modules/nutrition-generator/foods/foods.module';

@Module({
  imports: [DiseaseCausesModule, DiseasesModule, FoodsModule],
})
export class NutritionGeneratorDomainsModule {}
