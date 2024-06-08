import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { PatientState } from 'src/shared/enums/project';

export type CreatePatient = Partial<Patient> & {
  isActive: boolean;
};
//todo: remove it if work the previous
/* export interface CreatePatient {
  professional: string;
  isActive: boolean;
  location?: string;
  timezone?: string;
  height?: number;
  weight?: number;
  birthday?: Date;
  gender?: string;
  profilePicture?: string;
  codeCountry?: string;
  phone?: string;
} */


export type UpdatePatient = {
  // professional: string;
  patient: string;
  state: PatientState;
};

export interface DeleteManyPatientGroup {
  professional: string;
  patientGroup: string;
}
