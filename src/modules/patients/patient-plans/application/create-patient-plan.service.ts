import { Injectable } from '@nestjs/common';
import { CreatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/create-patient-plan.dto';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';

@Injectable()
export class CreatePatientPlanService {
  constructor(private cps: PatientsPersistenceService, private cpps: PatientPlansPersistenceService) {}

  async createPatientPlan(dto: CreatePatientPlanDto): Promise<PatientPlan> {
    await this.cps.getPatient(dto.professional, dto.patient);
    const patientPlan = await this.cpps.createPatientPlan(dto);
    return patientPlan;
  }
}
