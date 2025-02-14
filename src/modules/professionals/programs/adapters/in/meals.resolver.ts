import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-meal.dto';
import { DeleteMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-meal.dto';
import { UpdateMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
import { NutritionalMealsPersistenceService } from 'src/modules/professionals/programs/adapters/out/meals-persistence.service';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class MealsResolver {
  constructor(private readonly mps: NutritionalMealsPersistenceService) {}

  @Mutation(() => Program)
  createMeal(
    @Args('toAddInput') dto: AddMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Program> {
    return this.mps.addMeal(dto, selectors);
  }

  @Mutation(() => Program)
  async updateMeal(
    @Args('toUpdateInput') dto: UpdateMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Program> {
    return this.mps.updateMeal(dto, selectors);
  }

  @Mutation(() => Program)
  async deleteMeal(
    @Args('toDeleteInput') dto: DeleteMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Program> {
    return this.mps.deleteMeal(dto, selectors);
  }
}
