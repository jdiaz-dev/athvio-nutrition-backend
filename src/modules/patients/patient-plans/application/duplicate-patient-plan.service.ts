import { Injectable } from '@nestjs/common';
import { DuplicatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/duplicate-patient-plan.dto';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';

@Injectable()
export class DuplicatePatientPlanService {
  constructor(private cpps: PatientPlansPersistenceService) {}

  async duplicatePatientPlan(
    { professional, patient, patientPlan, ...rest }: DuplicatePatientPlanDto,
    selectors: Record<string, number>,
  ): Promise<PatientPlan> {
    const _patientPlan = await this.cpps.getPatientPlan({ professional, patient, patientPlan }, selectors);

    delete _patientPlan._id;
    delete _patientPlan.assignedDate;
    for (let x = 0; x < _patientPlan.meals.length; x++) {
      delete _patientPlan.meals[x]._id;
      delete _patientPlan.meals[x].updatedAt;
    }
    _patientPlan;
    const programUpdated = await this.cpps.createPatientPlan({
      ..._patientPlan,
      patient,
      assignedDate: rest.assignedDate,
    });
    return programUpdated;
  }
}
