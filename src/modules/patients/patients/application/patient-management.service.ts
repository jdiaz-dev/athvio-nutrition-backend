import { BadRequestException, Injectable } from '@nestjs/common';
import { ManagePatientGroupDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-group.dto';
import { ManagePatientStateDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-state.dto';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { CreatePatient, UpdatePatient } from 'src/modules/patients/patients/adapters/out/patient.types';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import { ErrorPatientsEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class PatientManagementService {
  constructor(private pps: PatientsPersistenceService) {}

  async createPatient(createPatient: CreatePatient): Promise<Patient> {
    const patient = await this.pps.createPatient({ ...createPatient, isActive: true });

    return patient;
  }
  async updatePatient(updatePatient: UpdatePatient, selectors?: string[]): Promise<Patient> {
    const patient = await this.pps.updatePatient(updatePatient, selectors);
    if (patient == null) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);

    return patient;
  }
  async updatePatientGroup(dto: ManagePatientGroupDto): Promise<Patient> {
    const patient = await this.pps.updatePatientGroup(dto);
    if (patient == null) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);

    return patient;
  }
  async deleteManyPatientGroup(professional: string, patientGroup: string) {
    const patient = await this.pps.deleteManyPatientGroup({
      professional,
      patientGroup,
    });
    return patient;
  }
  async managePatientState(dto: ManagePatientStateDto, selectors: string[]): Promise<Patient> {
    const patient = await this.pps.managePatientState(dto, selectors);
    if (patient == null) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);

    return patient;
  }
}
