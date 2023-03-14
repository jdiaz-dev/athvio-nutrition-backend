import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AddProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/add-program-plan.dto';
import { DeleteProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/delete-program-plan.dto';
import { UpdateProgramPlanDto } from 'src/modules/professionals/programs/adapters/in/dtos/plan/update-program-plan.dto';
import { PlansPersistenceService } from 'src/modules/professionals/programs/adapters/out/plans-persistence.service';

import { Program } from 'src/modules/professionals/programs/adapters/out/program.schema';
import { AuthorizationGuard } from 'src/modules/security/security/adapters/in/guards/authorization.guard';
import { AuthorizationProfessionalGuard } from 'src/shared/guards/authorization-professional.guard';
import { selectorExtractor } from 'src/shared/helpers/functions';

@Resolver()
@UseGuards(...[AuthorizationGuard, AuthorizationProfessionalGuard])
export class PlansResolver {
  constructor(private readonly pps: PlansPersistenceService) {}

  @Mutation(() => Program)
  addProgramPlan(
    @Args('input') dto: AddProgramPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.pps.addProgramPlan(dto, selectors);
  }

  @Mutation(() => Program)
  async updateProgramPlan(
    @Args('input') dto: UpdateProgramPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.pps.updateProgramPlan(dto, selectors);
  }
  @Mutation(() => Program)
  async deleteProgramPlan(
    @Args('input') dto: DeleteProgramPlanDto,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.pps.deleteProgramPlan(dto, selectors);
  }
}
