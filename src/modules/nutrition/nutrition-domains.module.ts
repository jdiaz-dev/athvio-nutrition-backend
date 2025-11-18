import { Module } from '@nestjs/common';
import { FoodsModule } from 'src/modules/nutrition/foods/foods.module';
import { FormulasModule } from 'src/modules/nutrition/formulas/formulas.module';

@Module({
  imports: [FoodsModule, FormulasModule],
})
export class NutritionDomainsModule {}
