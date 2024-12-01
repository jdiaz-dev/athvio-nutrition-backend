import { CustomRecipesModule } from 'src/modules/professionals/custom-recipes/custom-recipes.module';
import { Module } from '@nestjs/common';
import { FoodsResolver } from 'src/modules/foods/adapters/in/foods.resolver';
import { FoodsProviderService } from 'src/modules/foods/adapters/out/providers/foods-provider.service';
import { GetFoodsService } from 'src/modules/foods/application/get-foods.service';
import { FoodTextSearcherService } from 'src/modules/foods/application/food-text-searcher.service';
import { CustomRecipesTransformerService } from 'src/modules/foods/application/custom-recipes-transformer.service';
import { AuthenticationModule } from 'src/modules/authentication/authentication/authentication.module';
import { SharedModule } from 'src/shared/shared.module';
import { ProviderFoodTransformerService } from 'src/modules/foods/adapters/out/providers/provider-foods-transformer.service';

const resolvers = [FoodsResolver];
const internalServices = [
  GetFoodsService,
  FoodsProviderService,
  ProviderFoodTransformerService,
  CustomRecipesTransformerService,
  FoodTextSearcherService,
];

@Module({
  imports: [SharedModule, CustomRecipesModule, AuthenticationModule],
  providers: [...resolvers, ...internalServices],
})
export class FoodsModule {}
