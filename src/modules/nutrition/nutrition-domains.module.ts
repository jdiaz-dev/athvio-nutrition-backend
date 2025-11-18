import { Module } from '@nestjs/common';
import { FoodsModule } from 'src/modules/nutrition/foods/foods.module';

@Module({
  imports: [FoodsModule],
})
export class NutritionDomainsModule {}
