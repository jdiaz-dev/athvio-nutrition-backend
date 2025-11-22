import { Module } from '@nestjs/common';
import { FoodsModule } from 'src/modules/nutrition/foods/foods.module';
import { FormulasModule } from 'src/modules/nutrition/formulas/formulas.module';
import { InternalQuestionaryModule } from 'src/modules/nutrition/internal-questionary/internal-questionary.module';

@Module({
  imports: [FoodsModule, FormulasModule, InternalQuestionaryModule],
})
export class NutritionSubDomainsModule {}
