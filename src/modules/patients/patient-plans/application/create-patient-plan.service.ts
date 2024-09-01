import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePatientPlanDto } from 'src/modules/patients/patient-plans/adapters/in/dtos/plan/create-patient-plan.dto';
import { PatientPlan } from 'src/modules/patients/patient-plans/adapters/out/patient-plan.schema';
import { PatientPlansPersistenceService } from 'src/modules/patients/patient-plans/adapters/out/patient-plans-persistence.service';
import { PatientManagementService } from 'src/modules/patients/patients/application/patient-management.service';
import { ErrorPatientsEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class CreatePatientPlanService {
  constructor(private pms: PatientManagementService, private cpps: PatientPlansPersistenceService) {}

  async createPatientPlan(dto: CreatePatientPlanDto): Promise<PatientPlan> {
    const patient = await this.pms.getPatient(dto.professional, dto.patient);
    if (!patient) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);

    const patientPlan = await this.cpps.createPatientPlan(dto);
    return patientPlan;
  }
}
