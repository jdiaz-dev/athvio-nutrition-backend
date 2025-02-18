import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { PatientState } from 'src/shared/enums/project';

export type CreatePatient = Partial<Patient> & {
  isActive: boolean;
};

export type UpdatePatient = {
  //professional: string;
  user: string;
  state: PatientState;
};

export interface DeleteManyPatientGroup {
  professional: string;
  patientGroup: string;
}
