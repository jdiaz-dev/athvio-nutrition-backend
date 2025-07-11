import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ManagePatientGroupDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-group.dto';
import { ManagePatientStateDto } from 'src/modules/patients/patients/adapters/in/web/dtos/manage-patient-state.dto';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { CreatePatient, UpdatePatientState } from 'src/modules/patients/patients/helpers/patient.types';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import { ErrorPatientsEnum } from 'src/shared/enums/messages-response';
import { UpdatePatientWebDto } from 'src/modules/patients/patients/adapters/in/web/dtos/update-patient.dto';

@Injectable()
export class PatientManagerService {
  constructor(private pps: PatientsPersistenceService) {}

  async createPatient(createPatient: CreatePatient): Promise<Patient> {
    const patient = await this.pps.createPatient({ uuid: randomUUID(), ...createPatient, isActive: true });

    return patient;
  }
  async updatePatientState(updatePatient: UpdatePatientState, selectors?: string[]): Promise<Patient> {
    const patient = await this.pps.updatePatientByUser(updatePatient, selectors);
    if (patient == null) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);

    return patient;
  }
  async updatePatientInfo(dto: UpdatePatientWebDto, selectors?: string[]): Promise<Patient> {
    const patient = await this.pps.updatePatientByUuid(dto, selectors);
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
