import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddMealPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal-plan/add-meal-plan.dto';
import { DeleteMealPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal-plan/delete-meal-plan.dto';
import { UpdateMealPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/meal-plan/update-meal-plan.dto';
import { MealPlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/meal-plans-persistence.service';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor } from 'src/shared/helpers/graphql-helpers';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class MealPlansResolver {
  constructor(private readonly mpps: MealPlansPersistenceService) {}

  @Mutation(() => Program)
  addMealPlan(@Args('input') dto: AddMealPlanDto, @Info(...selectorExtractor()) selectors: string[]): Promise<Program> {
    return this.mpps.addMealPlan(dto, selectors);
  }

  @Mutation(() => Program)
  async updateMealPlan(
    @Args('input') dto: UpdateMealPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mpps.updateMealPlan(dto, selectors);
  }

  @Mutation(() => Program)
  async deleteMealPlan(
    @Args('input') dto: DeleteMealPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.mpps.deleteMealPlan(dto, selectors);
  }
}
