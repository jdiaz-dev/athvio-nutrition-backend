import { Module } from '@nestjs/common';
import { FoodsResolver } from 'src/modules/program-generator/foods/adapters/in/foods.resolver';
import { FoodsProviderService } from 'src/modules/program-generator/foods/adapters/out/providers/foods-provider.service';
import { GetFoodsService } from 'src/modules/program-generator/foods/application/get-foods.service';
import { FoodTextSearcherService } from 'src/modules/program-generator/foods/application/food-text-searcher.service';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { FoodParserService } from 'src/modules/program-generator/foods/application/foods-parser.service';
import { TranslatorService } from 'src/modules/program-generator/foods/adapters/out/providers/translator.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InternalFood, InternalFoodSchema } from 'src/modules/program-generator/foods/adapters/out/internal-food.schema';
import { FullDatabaseService } from 'src/modules/program-generator/foods/application/full-database.service';
import { InternalFoodsPersistenceService } from 'src/modules/program-generator/foods/adapters/out/internal-foods-persistence.service';
import { InternalCountersPersistenceService } from 'src/modules/program-generator/foods/adapters/out/internal-counters-persistence.service';
import { InternalCounter, InternalCounterSchema } from 'src/modules/program-generator/foods/adapters/out/internal-counter.schema';
import { PopulatorDatabaseResolver } from 'src/modules/program-generator/foods/adapters/in/populator-database.resolver';

const resolvers = process.env.POPULATE_DATABASE
  ? [FoodsResolver, PopulatorDatabaseResolver]
  : [FoodsResolver];

const internalServices = [
  GetFoodsService,
  TranslatorService,
  FoodsProviderService,
  FoodParserService,
  FoodTextSearcherService,
  FullDatabaseService,
  InternalFoodsPersistenceService,
  InternalCountersPersistenceService,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InternalFood.name, schema: InternalFoodSchema },
      { name: InternalCounter.name, schema: InternalCounterSchema },
    ]),
    SharedModule,
    AuthModule,
  ],
  providers: [...resolvers, ...internalServices],
})
export class FoodsModule {}
