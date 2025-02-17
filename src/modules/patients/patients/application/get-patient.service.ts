import { BadRequestException, Injectable } from '@nestjs/common';
import { GetPatientsDto, GetPatientsResponse } from 'src/modules/patients/patients/adapters/in/web/dtos/get-patients.dto';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { PatientsPersistenceService } from 'src/modules/patients/patients/adapters/out/patients-persistence.service';
import { ErrorPatientsEnum } from 'src/shared/enums/messages-response';

@Injectable()
export class GetPatientsService {
  constructor(private pps: PatientsPersistenceService) {}
  async getPatientForMobile(patient: string, selectors?: Record<string, number>) {
    const _patient = await this.pps.getPatient({ _id: patient }, selectors || { _id: 1 });
    return _patient;
  }
  async getPatient(patient: string, professional: string, selectors?: Record<string, number>) {
    const _patient = await this.pps.getPatient({ _id: patient, professional }, selectors || { _id: 1 });
    return _patient;
  }
  async getPatientById(patient: string): Promise<Patient> {
    const _patient = await this.pps.getPatientById(patient);
    if (!_patient) throw new BadRequestException(ErrorPatientsEnum.PATIENT_NOT_FOUND);

    return _patient;
  }
  async getPatientByUser(user: string): Promise<Patient> {
    const patient = await this.pps.getPatientByUser(user);
    return patient;
  }
  async getPatients(dto: GetPatientsDto, selectors: Record<string, number>): Promise<GetPatientsResponse> {
    const patients = await this.pps.getPatients(dto, selectors);
    return patients;
  }
  async getManyPatientsByIds(patients: string[]): Promise<Patient[]> {
    const _patients = await this.pps.getManyPatientsByIds(patients);
    if (_patients.length !== _patients.length) throw new BadRequestException(ErrorPatientsEnum.CLIENTS_TO_SEARCH_ERROR);
    return _patients;
  }
}
