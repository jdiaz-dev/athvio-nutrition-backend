import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddPlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/meals/add-meal.dto';
import { DeletePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/meals/delete-meal-plan.dto';
import { UpdatePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/meals/update-meal.dto';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlanMealsPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-meals-persistence.service';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor } from 'src/shared/helpers/graphql-helpers';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class MealsResolver {
  constructor(private readonly cpmps: PatientPlanMealsPersistenceService) {}

  @Mutation(() => PatientPlan)
  addPlanMeal(
    @Args('input') dto: AddPlanMealDto,
    @Info(...selectorExtractor()) selectors: string[]): Promise<PatientPlan> {
    return this.cpmps.addMealToPlan(dto, selectors);
  }
  @Mutation(() => PatientPlan)
  updatePlanMeal(
    @Args('input') dto: UpdatePlanMealDto,
    @Info(...selectorExtractor()) selectors: string[]): Promise<PatientPlan> {
    return this.cpmps.updatePlanMeal(dto, selectors);
  }
  @Mutation(() => PatientPlan)
  deletePlanMeal(
    @Args('input') dto: DeletePlanMealDto,
    @Info(...selectorExtractor()) selectors: string[]): Promise<PatientPlan> {
    return this.cpmps.deletePlanMeal(dto, selectors);
  }
}
