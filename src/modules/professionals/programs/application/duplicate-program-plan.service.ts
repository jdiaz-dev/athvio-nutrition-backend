import { Injectable } from '@nestjs/common';
import { DuplicateProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/duplicate-program-plan.dto';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';
import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramsPersistenceService } from 'src/modules/professionals/programs/adapters/out/programs-persistence.service';
import { planSelectors } from 'src/shared/enums/selectors';

@Injectable()
export class DuplicateProgramPlanService {
  constructor(
    private prps: ProgramsPersistenceService,
    private pps: PlansPersistenceService
  ) {}

  async duplicateProgramPlan(dto: DuplicateProgramPlanDto, selectors: Record<string, number>): Promise<Program> {
    const _program = await this.prps.getProgram(dto, planSelectors);
    console.log('--------program obtained', _program);

    const mealPlans = _program.plans[0].meals;
    for (let x = 0; x < mealPlans.length; x++) {
      delete _program.plans[0].meals[x]._id;
      delete _program.plans[0].meals[x].updatedAt;
    }
    console.log('--------meals', _program.plans[0].meals);

    const programUpdated = await this.pps.addProgramPlan({ ...dto, plans: _program.plans }, selectors);
    console.log('--------programUpdated', programUpdated);
    return programUpdated;
  }
}
