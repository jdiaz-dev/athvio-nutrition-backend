import { Module } from '@nestjs/common';
import { DiseaseCausesModule } from 'src/modules/program-builder/disease-causes/disease-causes.module';
import { DiseasesModule } from 'src/modules/program-builder/diseases/diseases.module';
import { FoodsModule } from 'src/modules/program-builder/foods/foods.module';
import { NutritionalPreferencesModule } from 'src/modules/program-builder/nutritional-preferences/nutritional-preferences.module';

@Module({
  imports: [DiseaseCausesModule, DiseasesModule, NutritionalPreferencesModule, FoodsModule],
})
export class ProgramBuilderDomainsModule {}
