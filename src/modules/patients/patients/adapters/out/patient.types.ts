import { PatientState } from 'src/shared/enums/project';

export interface CreatePatient {
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
}

export interface UpdatePatient extends CreatePatient {
  patient: string;
  state: PatientState;
}

export interface DeleteManyPatientGroup {
  professional: string;
  patientGroup: string;
}
