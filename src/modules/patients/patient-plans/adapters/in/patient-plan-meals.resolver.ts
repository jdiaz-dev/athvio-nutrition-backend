import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddPlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/meals/add-meal.dto';
import { DeletePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/meals/delete-meal-plan.dto';
import { UpdatePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/meals/update-meal.dto';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlanMealsPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-meals-persistence.service';
import { AuthorizationGuard } from 'src/modules/authentication/authentication/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';
import { AddPlanMealService } from 'src/modules/patients/patient-plans/application/add-plan-meal.service';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PatientPlanMealsResolver {
  constructor(private readonly apms: AddPlanMealService, private readonly cpmps: PatientPlanMealsPersistenceService) {}

  //todo: thinking in redux
  @Mutation(() => PatientPlan)
  addPlanMeal(@Args('toAddInput') dto: AddPlanMealDto, @Info(...selectorExtractor()) selectors: string[]): Promise<PatientPlan> {
    return this.apms.addPlanMeal(dto, selectors);
  }
  @Mutation(() => PatientPlan)
  updatePlanMeal(@Args('toUpdateInput') dto: UpdatePlanMealDto, @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>): Promise<PatientPlan> {
    return this.cpmps.updatePlanMeal(dto, selectors);
  }
  @Mutation(() => PatientPlan)
  deletePlanMeal(@Args('toDeleteInput') dto: DeletePlanMealDto, @Info(...selectorExtractor()) selectors: string[]): Promise<PatientPlan> {
    return this.cpmps.deletePlanMeal(dto, selectors);
  }
}
