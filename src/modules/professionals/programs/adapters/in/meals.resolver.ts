import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddMealPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/add-plan-meal.dto';
import { DeleteMealPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/delete-plan-meal.dto';
import { UpdateMealPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal/update-meal.dto';
import { MealsPersistenceService } from 'src/modules/professionals/programs/adapters/out/meals-persistence.service';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor } from 'src/shared/helpers/graphql-helpers';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class MealsResolver {
  constructor(private readonly mps: MealsPersistenceService) {}

  @Mutation(() => Program)
  createMealPlan(
    @Args('input') dto: AddMealPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mps.addMealPlan(dto, selectors);
  }

  @Mutation(() => Program)
  async updateMealPlan(
    @Args('input') dto: UpdateMealPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mps.updateMealPlan(dto, selectors);
  }

  @Mutation(() => Program)
  async deleteMealPlan(
    @Args('input') dto: DeleteMealPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mps.deleteMealPlan(dto, selectors);
  }
}
