import { Module } from '@nestjs/common';
import { FoodsResolver } from 'src/modules/program-generator/foods/adapters/in/foods.resolver';
import { FoodsProviderService } from 'src/modules/program-generator/foods/adapters/out/providers/foods-provider.service';
import { GetFoodsService } from 'src/modules/program-generator/foods/application/get-foods.service';
import { FoodTextSearcherService } from 'src/modules/program-generator/foods/application/food-text-searcher.service';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { ProviderFoodTransformerService } from 'src/modules/program-generator/foods/adapters/out/providers/provider-foods-transformer.service';
import { TranslatorService } from 'src/modules/program-generator/foods/adapters/out/providers/translator.service';

const resolvers = [FoodsResolver];
const internalServices = [
  GetFoodsService,
  TranslatorService,
  FoodsProviderService,
  ProviderFoodTransformerService,
  FoodTextSearcherService,
];

@Module({
  imports: [SharedModule, AuthModule],
  providers: [...resolvers, ...internalServices],
})
export class FoodsModule {}
