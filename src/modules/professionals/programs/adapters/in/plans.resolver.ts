import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/add-program-plan.dto';
import { DeleteProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/delete-program-plan.dto';
import { DuplicateProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/duplicate-program-plan.dto';
import { UpdatePlanAssignedWeekDayDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/update-plan-assigned-week-day.dto';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';

import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { ProgramPlanManagerService } from 'src/modules/professionals/programs/application/program-plan-manager.service';
import { AuthorizationGuard } from 'src/modules/auth/auth/adapters/in/web/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor, selectorExtractorForAggregation } from 'src/shared/helpers/graphql-helpers';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PlansResolver {
  constructor(private readonly pps: PlansPersistenceService, private readonly ppms: ProgramPlanManagerService) {}

  @Mutation(() => Program)
  addProgramPlan(
    @Args('input') dto: AddProgramPlanDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Program> {
    return this.ppms.addProgramPlan(dto, selectors);
  }
  @Mutation(() => Program)
  async duplicateProgramPlan(
    @Args('input') dto: DuplicateProgramPlanDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Program> {
    return await this.ppms.duplicateProgramPlan(dto, selectors);
  }
  @Mutation(() => Program)
  async updatePlanAssignedWeekDay(
    @Args('input') dto: UpdatePlanAssignedWeekDayDto,
    @Info(...selectorExtractorForAggregation()) selectors: Record<string, number>,
  ): Promise<Program> {
    return this.pps.updatePlanAssignedWeekDay(dto, selectors);
  }
  @Mutation(() => Program)
  async deleteProgramPlan(
    @Args('input') dto: DeleteProgramPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.pps.deleteProgramPlan(dto, selectors);
  }
}
