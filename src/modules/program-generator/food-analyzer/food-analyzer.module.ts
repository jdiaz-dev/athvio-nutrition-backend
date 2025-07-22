import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth/auth.module';
import { FoodAnalyzersPersistenceService } from 'src/modules/program-generator/food-analyzer/adapters/out/food-analyzers-persistence.service';
import { FoodAnalyzersManagerService } from 'src/modules/program-generator/food-analyzer/application/food-analyzers-manager.service';
import { FoodAnalyzersResolver } from 'src/modules/program-generator/food-analyzer/adapters/in/food-analyzers.resolver';

@Module({
  imports: [AuthModule],
  providers: [FoodAnalyzersResolver, FoodAnalyzersManagerService, FoodAnalyzersPersistenceService],
})
export class FoodAnalyzersModule {}
