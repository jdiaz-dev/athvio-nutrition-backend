import { Module } from '@nestjs/common';
import { DiseaseCausesModule } from 'src/modules/program-generator/disease-causes/disease-causes.module';
import { DiseasesModule } from 'src/modules/program-generator/diseases/diseases.module';
import { FoodsModule } from 'src/modules/program-generator/foods/foods.module';
import { NutritionalPreferencesModule } from 'src/modules/program-generator/nutritional-preferences/nutritional-preferences.module';

@Module({
  imports: [DiseaseCausesModule, DiseasesModule, NutritionalPreferencesModule, FoodsModule],
})
export class ProgramGeneratorDomainsModule {}
