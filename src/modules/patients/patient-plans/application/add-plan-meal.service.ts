import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlanNutritionalMealsPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-meals-persistence.service';
import { AddPlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/meals/add-meal.dto';
import { ErrorPatientPlanEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class AddPlanMealService {
  constructor(private ppmps: PatientPlanNutritionalMealsPersistenceService) {}

  async addPlanMeal({ meals, ...restDto }: AddPlanMealDto, selectors: Record<string, number>): Promise<PatientPlan> {
    const patientPlanRes = await this.ppmps.addMealToPlan(
      { meals: meals.map((meal) => ({ uuid: randomUUID(), ...meal })), ...restDto },
      selectors,
    );
    if (patientPlanRes === null) throw new BadRequestException(ErrorPatientPlanEnum.CLIENT_PLAN_NOT_FOUND);

    return patientPlanRes;
  }
}
