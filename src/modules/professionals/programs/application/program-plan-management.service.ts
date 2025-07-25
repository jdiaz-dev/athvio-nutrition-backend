import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AddProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/add-program-plan.dto';
import { DuplicateProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/duplicate-program-plan.dto';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
import { programPlanSelector } from 'src/modules/professionals/programs/adapters/out/program-plan-selectors';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramManagerService } from 'src/modules/professionals/programs/application/program-manager.service';
import { Meal } from 'src/shared/schemas/meal-plan';

@Injectable()
export class ProgramPlanManagementService {
  constructor(
    private readonly pms: ProgramManagerService,
    private readonly pps: PlansPersistenceService,
  ) {}

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
          uuid: randomUUID(),
          ...rest,
          meals: meals.map((item) => ({ uuid: randomUUID(), ...item })) as Meal[],
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
    const _program = await this.pms.getProgram({ professional, program, plan }, programPlanSelector);

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
          uuid: randomUUID(),
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
