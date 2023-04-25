import { CustomRecipesModule } from 'src/modules/professionals/custom-recipes/custom-recipes.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodsResolver } from 'src/modules/foods/adapters/in/foods.resolver';
import { Food, FoodSchema } from 'src/modules/foods/adapters/out/food.schema';
import { FoodsProviderService } from 'src/modules/foods/adapters/out/providers/foods-provider.service';
import { GetFoodsService } from 'src/modules/foods/application/get-foods.service';
import { HttpWrapperService } from 'src/shared/services/http-wrapper.service';
import { FoodTextSearcherService } from 'src/modules/foods/application/food-text-searcher.service';
import { UsersModule } from 'src/modules/security/users/users.module';
import { SerializeFoodsFromProviderService } from 'src/modules/foods/application/serialize-foods-from-provider.service';

const resolvers = [FoodsResolver];
const externalServices = [HttpWrapperService];
const internalServices = [GetFoodsService, FoodsProviderService, SerializeFoodsFromProviderService, FoodTextSearcherService];

@Module({
  imports: [MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }]), HttpModule, CustomRecipesModule, UsersModule],
  providers: [...resolvers, ...externalServices, ...internalServices],
})
export class FoodsModule {}
