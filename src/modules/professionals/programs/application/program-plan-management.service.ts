import { Injectable } from '@nestjs/common';
import { DuplicateProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/duplicate-program-plan.dto';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
import { programPlanSelector } from 'src/modules/professionals/programs/adapters/out/program-plan-selectors';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';

@Injectable()
export class ProgramPlanManagementService {
  constructor(private prps: ProgramsPersistenceService, private pps: PlansPersistenceService) {}

  async addProgramPlan() {}
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
