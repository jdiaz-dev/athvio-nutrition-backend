// import { FieldMap } from '@jenyus-org/nestjs-graphql-utils';
import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/create-nutritional-meal.dto';
import { DeleteNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/delete-nutritional-meal.dto';
import { GetNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/get-nutritional-meal.dto';
import {
  GetNutritionalMealsDto,
  GetNutritionalMealsResponse,
} from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/get-nutritional-meals.dto';
import { UpdateNutritionalMealDto } from 'src/modules/professionals/nutritional-meals/adapters/in/dtos/update-nutritional-meal.dto';
import { NutritionalMeal } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meal.schema';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/nutritional-meals/adapters/out/nutritional-meals-persistence.service';
import { NutritionalMealsManagementService } from 'src/modules/professionals/nutritional-meals/application/nutritional-meals-management.service';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

@Resolver(() => NutritionalMeal)
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class NutritionalMealsResolver {
  constructor(private readonly crps: NutritionalMealsPersistenceService, private crms: NutritionalMealsManagementService) {}

  @Mutation(() => NutritionalMeal)
  createNutritionalMeal(@Args('input') dto: CreateNutritionalMealDto): Promise<NutritionalMeal> {
    return this.crms.createNutritionalMeal(dto);
  }

  @Query(() => NutritionalMeal)
  async getNutritionalMeal(
    @Args('input') dto: GetNutritionalMealDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<NutritionalMeal> {
    const nutritionalMeal = await this.crps.getNutritionalMeal(dto, selectors);
    return nutritionalMeal;
  }

  @Query(() => GetNutritionalMealsResponse)
  async getNutritionalMeals(
    @Args('input') dto: GetNutritionalMealsDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<GetNutritionalMealsResponse> {
    const nutritionalMeal = await this.crps.getNutritionalMeals(dto, selectors);
    return nutritionalMeal;
  }

  @Mutation(() => NutritionalMeal)
  async updateNutritionalMeal(@Args('input') dto: UpdateNutritionalMealDto): Promise<NutritionalMeal> {
    return this.crps.updateNutritionalMeal(dto);
  }

  @Mutation(() => NutritionalMeal)
  deleteNutritionalMeal(@Args('input') dto: DeleteNutritionalMealDto): Promise<NutritionalMeal> {
    return this.crps.deleteNutritionalMeal(dto);
  }
}
