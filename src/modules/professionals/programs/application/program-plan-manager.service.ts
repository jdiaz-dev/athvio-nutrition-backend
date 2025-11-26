import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AddProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/add-program-plan.dto';
import { DuplicateProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/duplicate-program-plan.dto';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramManagerService } from 'src/modules/professionals/programs/application/program-manager.service';
import { ProgramMealImageManagerService } from 'src/modules/professionals/programs/application/program-meal-image-manager.service';

@Injectable()
export class ProgramPlanManagerService {
  constructor(
    private readonly pms: ProgramManagerService,
    private readonly pps: PlansPersistenceService,
    private readonly upmis: ProgramMealImageManagerService,
  ) {}

  async addProgramPlan(
    { professional, program, planBody }: AddProgramPlanDto,
    selectors: Record<string, number>,
  ): Promise<Program> {
    const { meals, ...rest } = planBody;
    const imageMealsProcessed = await this.upmis.processImageMeals(meals);

    const _program = await this.pps.addProgramPlanWithMeals(
      {
        professional,
        program,
        planBody: {
          uuid: randomUUID(),
          ...rest,
          meals: imageMealsProcessed,
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
    const _program = await this.pms.getProgram({ professional, program, plan }, { plans: 1, name: 1, description: 1 });

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
