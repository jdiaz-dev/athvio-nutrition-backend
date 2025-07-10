import { User } from 'src/modules/auth/users/adapters/out/user.schema';
import { Patient } from 'src/modules/patients/patients/adapters/out/patient.schema';
import { PatientState } from 'src/shared/enums/project';

export type CreatePatient = Partial<Patient> & {
  isActive: boolean;
};

export type PatientPopulatedWithUser = Patient & {
  user: User;
};

export type UpdatePatientState = {
  //professional: string;
  user: string;
  state: PatientState;
};

export interface DeleteManyPatientGroup {
  professional: string;
  patientGroup: string;
  
}
