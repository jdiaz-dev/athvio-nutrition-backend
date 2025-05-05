import { Module } from '@nestjs/common';
import { FoodsResolver } from 'src/modules/program-generator/foods/adapters/in/foods.resolver';
import { FoodsProviderService } from 'src/modules/program-generator/foods/adapters/out/providers/foods-provider.service';
import { GetFoodsService } from 'src/modules/program-generator/foods/application/get-foods.service';
import { FoodTextSearcherService } from 'src/modules/program-generator/foods/application/food-text-searcher.service';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { ProviderFoodTransformerService } from 'src/modules/program-generator/foods/adapters/out/providers/provider-foods-transformer.service';
import { TranslatorService } from 'src/modules/program-generator/foods/adapters/out/providers/translator.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InternalFood, InternalFoodSchema } from 'src/modules/program-generator/foods/adapters/out/internal-food.schema';
import { FullDatabaseService } from 'src/modules/program-generator/foods/application/full-database.service';
import { InternalFoodsPersistenceService } from 'src/modules/program-generator/foods/adapters/out/internal-foods-persistence.service';

const resolvers = [FoodsResolver];
const internalServices = [
  GetFoodsService,
  TranslatorService,
  FoodsProviderService,
  ProviderFoodTransformerService,
  FoodTextSearcherService,
  FullDatabaseService,
  InternalFoodsPersistenceService,
];

@Module({
  imports: [MongooseModule.forFeature([{ name: InternalFood.name, schema: InternalFoodSchema }]), SharedModule, AuthModule],
  providers: [...resolvers, ...internalServices],
})
export class FoodsModule {}
