import { Plan, Program } from 'src/modules/professionals/programs/adapters/out/program.schema';

export type ProgramPlanFilteredByDay = {
  professional: string;
  program: string;
  day: number;
};

export type ProgramPatial = Pick<Program, 'plans' | 'patients' | 'isSyncActive'>;

export type AddProgramPlanWithMeals = {
  professional: string;
  program: string;
  planBody: Pick<Plan, 'title' | 'day' | 'week' | 'meals'> & Partial<Pick<Plan, 'planDetail'>>;
};
