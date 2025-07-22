import { Args, Info, Query, Resolver } from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { FoodAnalyzer } from 'src/modules/program-generator/food-analyzer/adapters/out/food-analyzer.schema';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { GetAnalyzedFoodsDto } from 'src/modules/program-generator/food-analyzer/adapters/in/dtos/get-analyzed-foods.dto';
import { FoodAnalyzersManagerService } from 'src/modules/program-generator/food-analyzer/application/food-analyzers-manager.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class FoodAnalyzersResolver {
  constructor(private readonly faps: FoodAnalyzersManagerService) {}

  @Query(() => [FoodAnalyzer])
  async getAnalyzedFoods(
    @Args('input') dto: GetAnalyzedFoodsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<FoodAnalyzer[]> {
    selectors;
    const diseases = await this.faps.getFoodAnalyzers(dto.internalFoods);
    return diseases;
  }
}
