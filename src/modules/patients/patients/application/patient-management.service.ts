import { Injectable } from '@nestjs/common';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { CreatePatient, UpdatePatient } from 'src/modules/patients/patients/adapters/out/patient.types';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';

@Injectable()
export class PatientManagementService {
  constructor(private pps: PatientsPersistenceService) {}

  async createPatient(createPatient: CreatePatient): Promise<Patient> {
    const patient = await this.pps.createPatient({ ...createPatient, isActive: true });

    return patient;
  }
  async updatePatient(updatePatient: UpdatePatient, selectors?: string[]): Promise<Patient> {
    const patient = await this.pps.updatePatient(updatePatient, selectors);
    return patient;
  }
  async deleteManyPatientGroup(professional: string, patientGroup: string) {
    const patient = await this.pps.deleteManyPatientGroup({
      professional,
      patientGroup,
    });
    return patient;
  }
  async getManyPatientsByIds(ṕatients: string[]): Promise<Patient[]> {
    const _patients = await this.pps.getManyPatientsByIds(ṕatients);
    return _patients;
  }
}
