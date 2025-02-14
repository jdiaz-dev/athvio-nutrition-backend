import { BadRequestException, Injectable } from '@nestjs/common';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlanNutritionalMealsPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-meals-persistence.service';
import { AddPlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/add-meal.dto';
import { ErrorPatientPlanEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class AddPlanMealService {
  constructor(private ppmps: PatientPlanNutritionalMealsPersistenceService) {}

  async addPlanMeal(dto: AddPlanMealDto, selectors: Record<string, number>): Promise<PatientPlan> {
    const patientPlanRes = await this.ppmps.addMealToPlan(dto, selectors);
    if (patientPlanRes === null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);

    return patientPlanRes;
  }
}
