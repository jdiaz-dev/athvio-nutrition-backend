import { Module } from '@nestjs/common';
import { DiseaseCausesModule } from 'src/modules/program-generator/disease-causes/disease-causes.module';
import { DiseasesModule } from 'src/modules/program-generator/diseases/diseases.module';
import { FoodsModule } from 'src/modules/program-generator/foods/foods.module';
import { GptModule } from 'src/modules/program-generator/gpt/gpt.module';
import { NutritionalPreferencesModule } from 'src/modules/program-generator/nutritional-preferences/nutritional-preferences.module';
import { ProgramGeneratorModule } from 'src/modules/program-generator/program-generator/program-generator.module';

@Module({
  imports: [DiseaseCausesModule, DiseasesModule, NutritionalPreferencesModule, FoodsModule, GptModule, ProgramGeneratorModule],
})
export class ProgramGeneratorDomainsModule {}
