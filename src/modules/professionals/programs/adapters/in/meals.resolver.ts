import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddPlanMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-plan-meal.dto';
import { DeletePlanMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-plan-meal.dto';
import { UpdateMealDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
import { MealsPersistenceService } from 'src/modules/professionals/programs/adapters/out/meals-persistence.service';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor } from 'src/shared/helpers/functions';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class MealsResolver {
  constructor(private readonly mps: MealsPersistenceService) {}

  @Mutation(() => Program)
  createPlanMeal(
    @Args('input') dto: AddPlanMealDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mps.addPlanMeal(dto, selectors);
  }

  @Mutation(() => Program)
  async updatePlanMeal(
    @Args('input') dto: UpdateMealDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mps.updatePlanMeal(dto, selectors);
  }

  @Mutation(() => Program)
  async deletePlanMeal(
    @Args('input') dto: DeletePlanMealDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mps.deletePlanMeal(dto, selectors);
  }
}
