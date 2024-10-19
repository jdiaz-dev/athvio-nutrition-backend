import { Injectable } from '@nestjs/common';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';

@Injectable()
export class GetPatientsService {
  constructor(private pps: PatientsPersistenceService) {}

  async getPatient(professional: string, patient: string) {
    const _patient = await this.pps.getPatient(professional, patient, { _id: 1 });
    return _patient;
  }
  async getPatientById(patient: string): Promise<Patient> {
    const _patient = await this.pps.getPatientById(patient);
    return _patient;
  }
  async getPatientByUser(user: string): Promise<Patient> {
    const patient = await this.pps.getPatientByUser(user);
    return patient;
  }
  async getManyPatientsByIds(ṕatients: string[]): Promise<Patient[]> {
    const _patients = await this.pps.getManyPatientsByIds(ṕatients);
    return _patients;
  }
}
