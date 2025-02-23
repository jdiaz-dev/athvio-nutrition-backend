import { Module } from '@nestjs/common';
import { FoodsResolver } from 'src/modules/program-generator/foods/adapters/in/foods.resolver';
import { FoodsProviderService } from 'src/modules/program-generator/foods/adapters/out/providers/foods-provider.service';
import { GetFoodsService } from 'src/modules/program-generator/foods/application/get-foods.service';
import { FoodTextSearcherService } from 'src/modules/program-generator/foods/application/food-text-searcher.service';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { SharedModule } from 'src/shared/shared.module';
import { ProviderFoodTransformerService } from 'src/modules/program-generator/foods/adapters/out/providers/provider-foods-transformer.service';

const resolvers = [FoodsResolver];
const internalServices = [GetFoodsService, FoodsProviderService, ProviderFoodTransformerService, FoodTextSearcherService];

@Module({
  imports: [SharedModule, AuthenticationModule],
  providers: [...resolvers, ...internalServices],
})
export class FoodsModule {}
