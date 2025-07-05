import { CreateProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/create-program.dto';
import { GetProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/get-program.dto';
import { Plan, Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { EnumSources } from 'src/shared/enums/project';

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

export type CreateProgram = CreateProgramDto &
  Pick<Program, 'uuid'> & {
    plans?: Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>[];
    source?: EnumSources;
  };
export type GetProgram = Partial<GetProgramDto> & { name?: string; source?: EnumSources; language?: 'en' | 'es' };
