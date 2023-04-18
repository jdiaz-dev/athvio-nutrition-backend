import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodsResolver } from 'src/modules/foods/adapters/in/foods.resolver';
import { Food, FoodSchema } from 'src/modules/foods/adapters/out/food.schema';
import { FoodsPersistenceService } from 'src/modules/foods/adapters/out/foods-persistence.service';
import { FoodsProviderService } from 'src/modules/foods/adapters/out/providers/foods-provider.service';
import { GetFoodsService } from 'src/modules/foods/application/get-foods.service';
import { HttpWrapperService } from 'src/shared/services/http-wrapper.service';

const resolvers = [FoodsResolver];
const externalServices = [HttpWrapperService];
const interalServices = [FoodsPersistenceService, GetFoodsService, FoodsProviderService];

@Module({
  imports: [MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }]), HttpModule],
  providers: [...resolvers, ...externalServices, ...interalServices],
})
export class FoodsModule {}
