import { CreateProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/create-program.dto';
import { GetProgramDto } from 'src/modules/professionals/programs/adapters/in/dtos/program/get-program.dto';
import { Plan, Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { EnumSources } from 'src/shared/enums/project';
import { Meal } from 'src/shared/schemas/meal-plan';

type RequiredDataMeal = Omit<Meal, '_id' | 'isDeleted' | 'createdAt' | 'updatedAt'>;
export type ProgramPlanFilteredByDay = {
  professional: string;
  program: string;
  day: number;
};

export type ProgramPatial = Pick<Program, 'plans' | 'patients' | 'isSyncActive'>;

export type AddProgramPlanWithMeals = {
  professional: string;
  program: string;
  planBody: Pick<Plan, 'uuid' | 'title' | 'day' | 'week'> &
    Partial<Pick<Plan, 'planDetail'>> & {
      meals: RequiredDataMeal[];
    };
};

export type CreateProgram = Omit<CreateProgramDto, 'professional'> &
  Pick<Program, 'uuid' | 'professional'> & {
    plans?: Omit<Plan, '_id' | 'createdAt' | 'updatedAt'>[];
    source?: EnumSources;
  };
export type GetProgram = Partial<GetProgramDto> & { name?: string; source?: EnumSources; language?: 'en' | 'es' };

export type AddPlanMeal = {
  professional: string;
  program: string;
  plan: string;
  meals: RequiredDataMeal[];
};
