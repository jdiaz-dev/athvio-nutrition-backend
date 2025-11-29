import { BadRequestException, Injectable } from '@nestjs/common';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlanNutritionalMealsPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-meals-persistence.service';
import { AddPlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/add-meal.dto';
import { ErrorPatientPlanEnum } from 'src/shared/enums/messages-response';
import { MealImagesManagerService } from 'src/shared/services/meal-images-manager.service';
import { UpdatePlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/update-meal.dto';

@Injectable()
export class PatientPlanMealManagerService {
  constructor(
    private ppmps: PatientPlanNutritionalMealsPersistenceService,
    private readonly mims: MealImagesManagerService,
  ) {}

  async addPlanMeals({ meals, ...restDto }: AddPlanMealDto, selectors: Record<string, number>): Promise<PatientPlan> {
    const imageMealsProcessed = await this.mims.processImageMeals(meals);
    const patientPlanRes = await this.ppmps.addMealToPlan({ ...restDto, meals: imageMealsProcessed }, selectors);
    if (patientPlanRes === null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);

    return patientPlanRes;
  }
  async updatePlanMeals({ meals, ...restDto }: UpdatePlanMealDto, selectors: Record<string, number>): Promise<PatientPlan> {
    const imageMealsProcessed = await this.mims.processImageMeals(meals);
    const patientPlanRes = this.ppmps.updatePlanMeal({ ...restDto, meals: imageMealsProcessed }, selectors);
    if (patientPlanRes === null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);
    return patientPlanRes;
  }
}
