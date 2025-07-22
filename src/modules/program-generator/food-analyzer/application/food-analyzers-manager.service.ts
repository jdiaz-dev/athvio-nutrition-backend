import { Injectable } from '@nestjs/common';
import { FoodAnalyzersPersistenceService } from 'src/modules/program-generator/food-analyzer/adapters/out/food-analyzers-persistence.service';
import { FoodAnalyzer } from 'src/modules/program-generator/food-analyzer/adapters/out/food-analyzer.schema';

@Injectable()
export class FoodAnalyzersManagerService {
  constructor(private readonly dps: FoodAnalyzersPersistenceService) {}

  async getFoodAnalyzers(internalFoodIds: string[]): Promise<FoodAnalyzer[]> {
    return this.dps.getFoodAnalyzers(internalFoodIds);
  }
}
