import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { CreatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/create-patient-plan.dto';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlanPartial } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.type';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { GetPatientManagerService } from 'src/modules/patients/patients/application/get-patient-manager.service';
import { Meal } from 'src/shared/schemas/meal-plan';

@Injectable()
export class CreatePatientPlanManagerService {
  constructor(
    private gps: GetPatientManagerService,
    private cpps: PatientPlansPersistenceService,
  ) {}

  async createPatientPlan({ patient, professional, meals, ...rest }: CreatePatientPlanDto): Promise<PatientPlan> {
    await this.gps.getPatient(patient, professional);

    const patientPlan = await this.cpps.createPatientPlan({
      uuid: randomUUID(),
      patient,
      ...rest,
      meals: meals.map((meal) => ({ uuid: randomUUID(), ...meal })) as Meal[],
    });
    return patientPlan;
  }
  async createManyPatientPlan(dto: PatientPlanPartial[]): Promise<PatientPlan[]> {
    const patientPlans = await this.cpps.createManyPatientPlan(
      dto.map(({ meals, ...restPlan }) => ({
        ...restPlan,
        meals: meals.map((meal) => ({ ...meal, uuid: randomUUID() })),
        uuid: randomUUID(),
      })),
    );
    return patientPlans;
  }
}
