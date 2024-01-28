import { Program } from "src/modules/professionals/programs/adapters/out/program.schema";

export interface ProgramPlanFilteredByDay {
  professional: string;
  program: string;
  day: number;
}

export interface ProgramPatial extends Pick<Program, 'plans' | 'patients' | 'isSyncActive'> {};