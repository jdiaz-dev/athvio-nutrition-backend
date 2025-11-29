import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddPlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/add-meal.dto';
import { DeletePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/delete-meal-plan.dto';
import { UpdatePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/update-meal.dto';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlanNutritionalMealsPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-meals-persistence.service';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { PatientPlanMealManagerService } from 'src/modules/patients/patient-plans/application/patient-plan-meal-manager.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientPlanMealsResolver {
  constructor(
    private readonly ppmms: PatientPlanMealManagerService,
    private readonly cpmps: PatientPlanNutritionalMealsPersistenceService,
  ) {}

  @Mutation(() => PatientPlan)
  addPlanMeal(
    @Args('toAddInput') dto: AddPlanMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientPlan> {
    return this.ppmms.addPlanMeals(dto, selectors);
  }
  @Mutation(() => PatientPlan)
  updatePlanMeal(
    @Args('toUpdateInput') dto: UpdatePlanMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientPlan> {
    return this.ppmms.updatePlanMeals(dto, selectors);
  }
  @Mutation(() => PatientPlan)
  deletePlanMeal(
    @Args('toDeleteInput') dto: DeletePlanMealDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<PatientPlan> {
    return this.cpmps.deletePlanMeal(dto, selectors);
  }
}
