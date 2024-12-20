import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/web/dtos/plan/create-patient-plan.dto';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { GetPatientsService } from 'src/modules/patients/patients/application/get-patient.service';
import { ErrorPatientsEnum } from 'src/shared/enums/messages-response';
import { Meal } from 'src/shared/models/meal-plan';

@Injectable()
export class CreatePatientPlanService {
  constructor(private gps: GetPatientsService, private cpps: PatientPlansPersistenceService) {}

  async createPatientPlan({ patient, professional, meals, ...rest }: CreatePatientPlanDto): Promise<PatientPlan> {
    const _patient = await this.gps.getPatient(patient, professional);
    if (!_patient) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);

    const patientPlan = await this.cpps.createPatientPlan({ patient, ...rest, meals: meals as Meal[] });
    return patientPlan;
  }
}
