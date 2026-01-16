import { Module } from '@nestjs/common';
import { FoodsResolver } from 'src/modules/nutrition/foods/adapters/in/foods.resolver';
import { GetFoodsService } from 'src/modules/nutrition/foods/application/get-foods.service';
import { FoodTextSearcherService } from 'src/modules/nutrition/foods/application/food-text-searcher.service';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { FoodParserService } from 'src/modules/nutrition/foods/application/foods-parser.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InternalFood, InternalFoodSchema } from 'src/shared/adapters/out/schemas/internal-food.schema';
import { InternalFoodsPersistenceService } from 'src/modules/nutrition/foods/adapters/out/internal-foods-persistence.service';
import { CalculatorResolver } from 'src/modules/nutrition/foods/adapters/in/calculator.resolver';
import { NutrientsCalculatorService } from 'src/modules/nutrition/foods/application/nutrients-calculator.service';

const resolvers = [CalculatorResolver, FoodsResolver];

const internalServices = [
  GetFoodsService,
  FoodParserService,
  FoodTextSearcherService,
  InternalFoodsPersistenceService,
  NutrientsCalculatorService,
];

@Module({
  imports: [MongooseModule.forFeature([{ name: InternalFood.name, schema: InternalFoodSchema }]), SharedModule, AuthModule],
  providers: [...resolvers, ...internalServices],
})
export class FoodsModule {}
