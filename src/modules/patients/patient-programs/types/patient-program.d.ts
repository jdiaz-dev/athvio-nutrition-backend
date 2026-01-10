import { PatientProgram } from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';

export type CreatePatientProgram = Omit<PatientProgram, '_id'> &
  Pick<Program, 'uuid' | 'professional'> & {
    plans?: Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>[];
    source?: EnumSources;
  };
