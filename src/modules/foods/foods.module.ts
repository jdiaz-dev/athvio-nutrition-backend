import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodsResolver } from 'src/modules/foods/adapters/in/foods.resolver';
import { Food, FoodSchema } from 'src/modules/foods/adapters/out/food.schema';
import { FoodsPersistenceService } from 'src/modules/foods/adapters/out/foods-persistence.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }])],
  providers: [FoodsResolver, FoodsPersistenceService],
})
export class FoodsModule {}
