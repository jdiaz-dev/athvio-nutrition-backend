import { Injectable } from '@nestjs/common';
import { AddProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/add-program-plan.dto';
import { DuplicateProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/duplicate-program-plan.dto';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
import { programPlanSelector } from 'src/modules/professionals/programs/adapters/out/program-plan-selectors';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';
import { Meal } from 'src/shared/models/meal-plan';

@Injectable()
export class ProgramPlanManagementService {
  constructor(private prps: ProgramsPersistenceService, private pps: PlansPersistenceService) {}

  async addProgramPlan(
    { professional, program, planBody }: AddProgramPlanDto,
    selectors: Record<string, number>,
  ): Promise<Program> {
    const { meals, ...rest } = planBody;
    const _program = await this.pps.addProgramPlanWithMeals(
      {
        professional,
        program,
        planBody: {
          ...rest,
          meals: meals as Meal[],
        },
      },
      selectors,
    );
    return _program;
  }
  async duplicateProgramPlan(
    { professional, program, plan, day, week }: DuplicateProgramPlanDto,
    selectors: Record<string, number>,
  ): Promise<Program> {
    const _program = await this.prps.getProgram({ professional, program, plan }, programPlanSelector);

    for (let x = 0; x < _program.plans[0].meals.length; x++) {
      delete _program.plans[0].meals[x]._id;
      delete _program.plans[0].meals[x].updatedAt;
    }
    const baseProgramPlan = _program.plans[0];
    const programUpdated = await this.pps.addProgramPlanWithMeals(
      {
        professional,
        program,
        planBody: {
          day,
          week,
          title: baseProgramPlan.title,
          meals: baseProgramPlan.meals,
          planDetail: { isDuplicate: true, source: plan },
        },
      },
      selectors,
    );
    return programUpdated;
  }
}
