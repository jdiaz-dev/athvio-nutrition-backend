import { Module } from '@nestjs/common';
import { FoodsModule } from 'src/modules/health/foods/foods.module';
import { FormulasModule } from 'src/modules/health/formulas/formulas.module';
import { HabitsModule } from 'src/modules/health/habits/habits.module';
import { InternalQuestionaryModule } from 'src/modules/health/internal-questionary/internal-questionary.module';
import { OtherToolsModule } from 'src/modules/health/other-tools/other-tools.module';

@Module({
  imports: [FoodsModule, HabitsModule, OtherToolsModule, FormulasModule, InternalQuestionaryModule],
})
export class NutritionSubDomainsModule {}
