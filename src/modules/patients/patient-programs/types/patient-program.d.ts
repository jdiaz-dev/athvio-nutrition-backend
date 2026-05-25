import { GetPatientProgramDto } from 'src/modules/patients/patient-programs/adapters/in/dtos/patient-program/get-patient-program.dto';
import { PatientProgram } from 'src/modules/patients/patient-programs/adapters/out/patient-program.schema';
import { RequiredDataMeal } from 'src/shared/adapters/out/schemas/types';

export type CreatePatientProgram = Omit<PatientProgram, '_id'> &
  Pick<PatientProgram, 'uuid' | 'professional'> & {
    plans?: Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>[];
    source?: EnumSources;
  };

export type GetPatientProgram = Partial<GetPatientProgramDto>;

export type AddPatientProgramPlanWithMeals = {
  patient: string;
  patientProgram: string;
  planBody: Pick<Plan, 'uuid' | 'title' | 'day' | 'week'> &
    Partial<Pick<Plan, 'planDetail'>> & {
      meals: RequiredDataMeal[];
    };
};

export type AddPatientProgramPlanMeal = {
  patient: string;
  patientProgram: string;
  plan: string;
  meals: RequiredDataMeal[];
};
