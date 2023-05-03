import { CustomRecipesModule } from 'src/modules/professionals/custom-recipes/custom-recipes.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FoodsResolver } from 'src/modules/foods/adapters/in/foods.resolver';
import { FoodsProviderService } from 'src/modules/foods/adapters/out/providers/foods-provider.service';
import { GetFoodsService } from 'src/modules/foods/application/get-foods.service';
import { HttpWrapperService } from 'src/shared/services/http-wrapper.service';
import { FoodTextSearcherService } from 'src/modules/foods/application/food-text-searcher.service';
import { UsersModule } from 'src/modules/security/users/users.module';
import { ProviderFoodTransformerService } from 'src/modules/foods/application/provider-foods-transformer.service';
import { CustomRecipesTransformerService } from 'src/modules/foods/application/custom-recipes-transformer.service';

const resolvers = [FoodsResolver];
const externalServices = [HttpWrapperService];
const internalServices = [
  GetFoodsService,
  FoodsProviderService,
  ProviderFoodTransformerService,
  CustomRecipesTransformerService,
  FoodTextSearcherService,
];

@Module({
  imports: [HttpModule, CustomRecipesModule, UsersModule],
  providers: [...resolvers, ...externalServices, ...internalServices],
})
export class FoodsModule {}
