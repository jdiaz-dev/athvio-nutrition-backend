import { UseGuards } from '@nestjs/common';
import { Args, Context, Info, Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/modules/security/adapters/in/guards/authorization.guard';
import { AddProgramPlanDto } from 'src/modules/users/programs/adapters/in/dtos/plan/add-program-plan.dto';
import { DeleteProgramPlanDto } from 'src/modules/users/programs/adapters/in/dtos/plan/delete-program-plan.dto';
import { UpdateProgramPlanDto } from 'src/modules/users/programs/adapters/in/dtos/plan/update-program-plan.dto';
import { PlansPersistenceService } from 'src/modules/users/programs/adapters/out/plans-persistence.service';

import { Program } from 'src/modules/users/programs/adapters/out/program.schema';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { selectorExtractor } from 'src/shared/helpers/functions';
import { IUserContext } from 'src/shared/interfaces/user-context';

@Resolver()
export class PlansResolver {
  constructor(private readonly pps: PlansPersistenceService) {}

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  addProgramPlan(
    @Args('input') dto: AddProgramPlanDto,
    @Context() context: any,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.pps.addProgramPlan(dto, context.req.user.userId, selectors);
  }

  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  async updateProgramPlan(
    @Args('input') dto: UpdateProgramPlanDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.pps.updateProgramPlan(dto, context.userId, selectors);
  }
  @Mutation(() => Program)
  @UseGuards(AuthorizationGuard)
  async deleteProgramPlan(
    @Args('input') dto: DeleteProgramPlanDto,
    @CurrentUser() context: IUserContext,
    @Info(...selectorExtractor()) selectors: string[],
  ): Promise<Program> {
    return this.pps.deleteProgramPlan(dto, context.userId, selectors);
  }
}
