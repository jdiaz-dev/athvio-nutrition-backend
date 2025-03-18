import { UseGuards } from '@nestjs/common';
import { Args, Info, Query, Resolver } from '@nestjs/graphql';
import { GetNutritionalMealsResponse } from 'src/modules/professionals/nutritional-meals/adapters/in/web/dtos/get-nutritional-meals-for-professional.dto';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealsManagerService } from 'src/modules/professionals/nutritional-meals/application/nutritional-meals-manager.service';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { AuthorizationPatientGuard } from 'src/shared/guards/authorization-patient.guard';
import { GetNutritionalMealsForPatientDto } from 'src/modules/professionals/nutritional-meals/adapters/in/mobile/dtos/get-nutritional-meals-for-patient.dto';

@Resolver(() => NutritionalMeal)
@UseGuards(...[AuthorizationGuard, AuthorizationPatientGuard])
export class NutritionalMealsMobileResolver {
  constructor(private nmms: NutritionalMealsManagerService) {}

  @Query(() => GetNutritionalMealsResponse)
  async getNutritionalMealsForPatient(
    @Args('input') dto: GetNutritionalMealsForPatientDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    const nutritionalMeal = await this.nmms.getNutritionalMealsForPatient(dto, selectors);
    return nutritionalMeal;
  }
}
