import { Injectable } from '@nestjs/common';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlanMealsPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plan-meals-persistence.service';
import { AddPlanMealDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/meals/add-meal.dto';

@Injectable()
export class AddPlanMealService {
  constructor(private ppmps: PatientPlanMealsPersistenceService) {}

  async addPlanMeal(dto: AddPlanMealDto, selectors: string[]): Promise<PatientPlan> {
    const res = await this.ppmps.addMealToPlan(dto, selectors);
    return res;
  }
}
