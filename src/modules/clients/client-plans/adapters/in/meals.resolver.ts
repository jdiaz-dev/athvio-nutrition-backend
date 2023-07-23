import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddPlanMealDto } from 'src/modules/clients/client-plans/adapters/in/dtos/meals/add-meal.dto';
import { DeletePlanMealDto } from 'src/modules/clients/client-plans/adapters/in/dtos/meals/delete-meal-plan.dto';
import { UpdatePlanMealDto } from 'src/modules/clients/client-plans/adapters/in/dtos/meals/update-meal.dto';
import { ClientPlan } from 'src/modules/clients/client-plans/adapters/out/client-plan.schema';
import { ClientPlanMealsPersistenceService } from 'src/modules/clients/client-plans/adapters/out/client-plan-meals-persistence.service';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor } from 'src/shared/helpers/graphql-helpers';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class MealsResolver {
  constructor(private readonly cpmps: ClientPlanMealsPersistenceService) {}

  @Mutation(() => ClientPlan)
  addPlanMeal(
    @Args('input') dto: AddPlanMealDto,
    @Info(...selectorExtractor()) selectors: string[]): Promise<ClientPlan> {
    return this.cpmps.addMealToPlan(dto, selectors);
  }
  @Mutation(() => ClientPlan)
  updatePlanMeal(
    @Args('input') dto: UpdatePlanMealDto,
    @Info(...selectorExtractor()) selectors: string[]): Promise<ClientPlan> {
    return this.cpmps.updatePlanMeal(dto, selectors);
  }
  @Mutation(() => ClientPlan)
  deletePlanMeal(
    @Args('input') dto: DeletePlanMealDto,
    @Info(...selectorExtractor()) selectors: string[]): Promise<ClientPlan> {
    return this.cpmps.deletePlanMeal(dto, selectors);
  }
}
