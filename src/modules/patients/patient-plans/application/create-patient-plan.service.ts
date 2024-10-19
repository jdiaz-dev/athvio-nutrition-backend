import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/create-patient-plan.dto';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { GetPatientsService } from 'src/modules/patients/patients/application/get-patient.service';
import { ErrorPatientsEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class CreatePatientPlanService {
  constructor(private gps: GetPatientsService, private cpps: PatientPlansPersistenceService) {}

  async createPatientPlan(dto: CreatePatientPlanDto): Promise<PatientPlan> {
    const patient = await this.gps.getPatient(dto.patient, dto.professional);
    if (!patient) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);

    const patientPlan = await this.cpps.createPatientPlan(dto);
    return patientPlan;
  }
}
