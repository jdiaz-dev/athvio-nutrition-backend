import { Module } from '@nestjs/common';
import { FoodsModule } from 'src/modules/nutrition/foods/foods.module';
import { FormulasModule } from 'src/modules/nutrition/formulas/formulas.module';
import { HabitsModule } from 'src/modules/nutrition/habits/habits.module';
import { InternalQuestionaryModule } from 'src/modules/nutrition/internal-questionary/internal-questionary.module';
import { OtherToolsModule } from 'src/modules/nutrition/other-tools/other-tools.module';

@Module({
  imports: [FoodsModule, HabitsModule, OtherToolsModule, FormulasModule, InternalQuestionaryModule],
})
export class NutritionSubDomainsModule {}
