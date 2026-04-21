import { Module } from '@nestjs/common';
import { FoodsModule } from 'src/modules/nutrition/foods/foods.module';
import { FormulasModule } from 'src/modules/nutrition/formulas/formulas.module';
import { HabitsModule } from 'src/modules/nutrition/habits/habits.module';
import { InternalQuestionaryModule } from 'src/modules/nutrition/internal-questionary/internal-questionary.module';

@Module({
  imports: [FoodsModule, HabitsModule, FormulasModule, InternalQuestionaryModule],
})
export class NutritionSubDomainsModule {}
