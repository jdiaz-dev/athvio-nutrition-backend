import { Args, Query, Resolver } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/adapters/in/guards/authorization-professional.guard';
import { FoodAnalyzer } from 'src/modules/program-generator/food-analyzer/adapters/out/food-analyzer.schema';
import { GetAnalyzedFoodsDto } from 'src/modules/program-generator/food-analyzer/adapters/in/dtos/get-analyzed-foods.dto';
import { FoodAnalyzersManagerService } from 'src/modules/program-generator/food-analyzer/application/food-analyzers-manager.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class FoodAnalyzersResolver {
  constructor(private readonly faps: FoodAnalyzersManagerService) {}

  @Query(() => [FoodAnalyzer])
  async getAnalyzedFoods(@Args('input') dto: GetAnalyzedFoodsDto): Promise<FoodAnalyzer[]> {
    const analyzedFoods = await this.faps.getFoodAnalyzers(dto.internalFoods);
    return analyzedFoods;
  }
}
